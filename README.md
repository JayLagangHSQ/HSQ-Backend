APIs FOR THE DASHBOARD PAGE
 
 
Usecase: Can be used to retrieve overview data for the Dashboard page.
endpoint: https://hsqserver-833x.onrender.com/api/users/myDashboard
Method: GET,
headers:{
       Authorization: 'Bearer ${token}'
}
 
//-------------------------------------------//
 
Usecase: Update My Profile Picture
endpoint: https://hsqserver-833x.onrender.com/api/users/user/profilePicture/update
Method: PUT,
headers:{
       Authorization: 'Bearer ${token}'
}, 
body:{
       image: imageFile
}