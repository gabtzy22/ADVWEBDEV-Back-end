import fetch from "node-fetch"

const createAdminUser = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: "gabtzy",
        lastName: "mahina",
        age: "20",
        gender: "male",
        contactNumber: "096611771518",
        email: "cezzann69@gmail.com",
        type: "admin",
        username: "gabtzy23",
        password: "password123",
        address: "Manila City",
      }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log("✅ Admin user created successfully:", data)
    } else {
      console.log("❌ Error creating user:", data)
    }
  } catch (error) {
    console.error("❌ Network error:", error)
  }
}

createAdminUser()
