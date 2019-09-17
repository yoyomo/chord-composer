package main

import (
	"fmt"
	"log"
	"regexp"
	"strings"

	"net/http"
	"os"
	"io/ioutil"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/subosito/gotenv"

	"golang.org/x/net/context"
	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
	"google.golang.org/api/iterator"
	"cloud.google.com/go/firestore"
)

func init() {
	gotenv.Load()
}

var ctx context.Context
var client *firestore.Client

type User struct {
	First		string 	`firestore:"first,omitempty"`
	Middle	string 	`firestore:"middle,omitempty"`
	Last		string 	`firestore:"last,omitempty"`
	Born		int 		`firestore:"born,omitempty"`
}

func createUser(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	logFatal(err)

	var newUser User

	json.Unmarshal(reqBody, &newUser)

	_, _, err = client.Collection("users").Add(ctx, newUser)
	logFatal(err)

	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(newUser)

}

type ResourceType struct {
	User User
	NotUser User
}

func resourceType(resource string) {
	fmt.Println(string(strings.ToUpper(resource)[0])+resource[1:len(resource)-1])

	firstRE := regexp.MustCompile("^([a-z])")
	secondRE := regexp.MustCompile("([a-z]+)([^s])")
	thirdRE := regexp.MustCompile("(s$)")

	fmt.Println(firstRE.FindString(resource))
	fmt.Println(secondRE.FindString(resource[1:]))
	fmt.Println(thirdRE.FindString(resource))
}


func get(resource string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		resourceID := mux.Vars(r)["id"]

		dsnap, err := client.Collection(resource).Doc(resourceID).Get(ctx)
		logFatal(err)

		resourceType(resource)
		var data User
		dsnap.DataTo(&data)
		dsnap.Data()

		json.NewEncoder(w).Encode(data)
	}
}

func index(resource string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var users []User
		iter := client.Collection(resource).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				log.Fatalf("Failed to iterate: %v", err)
			}

			var user User
			doc.DataTo(&user)

			users = append(users, user)
		}

		json.NewEncoder(w).Encode(users)
	}
}

func updateUser(w http.ResponseWriter, r *http.Request) {

	reqBody, err := ioutil.ReadAll(r.Body)
	logFatal(err)

	userID := mux.Vars(r)["id"]

	var updatedUser User

	json.Unmarshal(reqBody, &updatedUser)

	_, err = client.Collection("users").Doc(userID).Set(ctx, updatedUser, firestore.MergeAll)
	logFatal(err)

	json.NewEncoder(w).Encode(updatedUser)
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	userID := mux.Vars(r)["id"]
	_, err := client.Collection("users").Doc(userID).Delete(ctx)
	logFatal(err)
}

func logFatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func resources(resource string, router *mux.Router) {
	router.HandleFunc("/"+resource, createUser).Methods("POST")
	router.HandleFunc("/"+resource, index("users")).Methods("GET")
	router.HandleFunc("/"+resource+"/{id}", get("users")).Methods("GET")
	router.HandleFunc("/"+resource+"/{id}", updateUser).Methods("PATCH")
	router.HandleFunc("/"+resource+"/{id}", deleteUser).Methods("DELETE")
}

func main() {

	sa := option.WithCredentialsFile("kordpose-firebase-adminsdk.json")
	ctx = context.Background()
	app, err := firebase.NewApp(ctx, nil, sa)
	logFatal(err)

	client, err = app.Firestore(ctx)
	logFatal(err)

	defer client.Close()

	router := mux.NewRouter().StrictSlash(true)

	resourceType("users")

	resources("users", router)

	port := os.Getenv("GO_SERVER_PORT")
	fmt.Println("Go Server listening at port: ", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}