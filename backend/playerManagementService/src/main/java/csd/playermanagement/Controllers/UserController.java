package csd.playermanagement.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import csd.playermanagement.Model.User;
import csd.playermanagement.Model.Tournament;
import csd.playermanagement.Service.FirestoreService;
import csd.playermanagement.Service.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/user")
public class UserController {
    
    @Autowired
    private UserService userService;

    @GetMapping("/registerTournament/{tournamentId}")
    // public ResponseEntity<String> registerUserForTournament(@PathVariable String tournamentId, @RequestParam String userId) {
    //     try {
    //         String response = userService.registerUserForTournament(tournamentId, userId);
    //         return ResponseEntity.ok(response);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    //     }
    // }


    @PutMapping("/updateUser/{userID}")
    public ResponseEntity<User> updateUserProfile(@PathVariable String userID, @RequestBody User updatedUser) {
        try {
            // Call the service to update the user and get the updated User object
            User updatedUserProfile = userService.updateUserProfile(userID, updatedUser);
            return ResponseEntity.ok(updatedUserProfile);  // Return the updated User object
        } catch (Exception e) {
            // Return 500 status with null if an exception occurs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PostMapping("/createUser")
    public ResponseEntity<String> createUser(@RequestBody User newUser) {
        try {
            String response = userService.createUserProfile(newUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers(){
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getUser/{userID}")
    public ResponseEntity<User> getUser(@PathVariable String userID) {
        try {
            User user = userService.getUserbyId(userID);
            return ResponseEntity.ok(user);  // Spring Boot will convert this to JSON automatically
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
}
