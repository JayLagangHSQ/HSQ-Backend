APIs FOR THE DASHBOARD PAGE

endpoint 1: https://hsqserver-833x.onrender.com/api/users/myDashboard,
Usecase: Can be used to retrieve overview data for the Dashboard page,
Method: GET,
headers:{
       Authorization: 'Bearer ${token}'
}

-------------------------------------------

endpoint 2: https://hsqserver-833x.onrender.com/api/users/user/profilePicture/update,
Usecase: Update My Profile Picture,
Method: PUT,
headers:{
       Authorization: 'Bearer ${token}'
}, 
body:{
       image: imageFile
}