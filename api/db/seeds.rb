user = User.create!(username: "first_user", email: "kordpad@gmail.com",
                   password: "123123",
                   confirmed_at: Time.now,
                   stripe_customer_id: "AAA",
                   stripe_subscription_id: "AAA",
                   stripe_plan_id: "AAA",
                   stripe_token_id: "AAA"
)

puts "Created user " + user.to_json.to_s