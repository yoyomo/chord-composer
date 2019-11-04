user = User.create!(username: "first_user", email: "kordpad@gmail.com",
                    password: "123123",
                    confirmed_at: Time.now,
                    favorite_chords: [],
                    stripe_customer_id: "cus_G3A8ZgV16SwBJj",
                    stripe_subscription_id: "sub_G3A8XfFHZDk9ui",
                    stripe_plan_id: "plan_FPRSWCfeC2eHz1",
                    stripe_token_id: "tok_1FX3imCK5Il4ajSVJnQNy7eI",
                    access_token: SecureRandom.hex)

user.create_or_update_customer_subscription

puts "Created user " + user.to_json.to_s
