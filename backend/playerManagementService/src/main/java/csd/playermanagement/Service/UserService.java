package csd.playermanagement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;

import csd.playermanagement.Model.Tournament;
import csd.playermanagement.Model.User;

@Service
public class UserService {

    @Autowired
    private Firestore firestore;

    public String registerUserForTournament(String tournamentId, String userId) throws InterruptedException, ExecutionException {
        System.out.println("Registering user for tournament...");
        System.out.println("tournamentId = " + tournamentId);

        // Retrieve the tournament document
        DocumentReference tournamentRef = firestore.collection("Tournaments").document(tournamentId);
        System.out.println("tournamentRef = " + tournamentRef);

        // Get the document's TOURNAMENT data
        DocumentSnapshot tournamentSnapshot = tournamentRef.get().get();
        // The first get() starts the asynchronous request to Firestore.
		// The second get() waits for the request to complete and retrieves the result.
        System.out.println("tournamentSnapshot = " + tournamentSnapshot);

        // No such Tournament
        if (!tournamentSnapshot.exists()) {
           return "Tournament not found.";
        }

        // Get the participants subcollection
        List<String> participants = tournamentSnapshot.toObject(Tournament.class).getParticipants();
        System.out.println("participants = " + participants);
        //check participants size
        System.out.println("participants size= " + participants.size());

        // Get the capacity size
        int capacityCount = tournamentSnapshot.getLong("capacity").intValue();
        System.out.println("capacity size= " + capacityCount);

        // Get the elo requirement
        int eloRequirement = tournamentSnapshot.getLong("eloRequirement").intValue();
        System.out.println("elo= " +eloRequirement);


        // USER LOGIC
        // Retrieve User document by UID (Query, not direct access)
        CollectionReference usersRef = firestore.collection("User");
        ApiFuture<QuerySnapshot> querySnapshot = usersRef.whereEqualTo("uid", userId).get();

        // Check if a document exists with the given UID
        List<QueryDocumentSnapshot> userDocuments = querySnapshot.get().getDocuments();
        if (!userDocuments.isEmpty()) {
            // Get the first document that matches the UID
            DocumentSnapshot userSnapshot = userDocuments.get(0);
            User user = userSnapshot.toObject(User.class);

            // Get user name
            System.out.println("User name: " + user.getUsername());
            
            // Get user ID
            System.out.println("User ID: " + user.getUid());
            
            // Get User elo
            System.out.println("User elo: " + user.getElo());

            // Logic for comparing the currentParticipantsCount with the capacity
            // If the currentParticipantsCount is less than the capacity
            // If elo > requirement also
            if (participants.size() < capacityCount && user.getElo() > eloRequirement) { // remove elo for testing purpose
                // Add the user to the participants list
                participants.add(user.getUid());

                // Update Firestore with the new participants list
                ApiFuture<WriteResult> writeResult = tournamentRef.update("participants", participants);
                writeResult.get();  // Wait for the operation to complete

                System.out.println("User added to the tournament.");
                return "User successfully registered for the tournament.";
            } 
            
            else {
                // User did not meet the criteria or tournament is full
                return "User not added: Either the tournament is full or the user's elo does not meet the requirement.";
            }
        } 
        else {
            // No user found with the given UID
            System.out.println("No user found with the given UID.");
            return "User not found.";
        }

    }

    public String updateUserProfile(String userId, User updatedUser) throws InterruptedException, ExecutionException {
        System.out.println("Updating User profile");

        // Retrieve the user document by querying for the UID
        CollectionReference usersRef = firestore.collection("User");
        ApiFuture<QuerySnapshot> querySnapshot = usersRef.whereEqualTo("uid", userId).get();
    
        // Check if a document exists with the given UID
        List<QueryDocumentSnapshot> userDocuments = querySnapshot.get().getDocuments();
    
        if (userDocuments.isEmpty()) {
            return "No user found with the provided UID.";
        }
    
        // Get the first document that matches the query (there should only be one)
        DocumentSnapshot userSnapshot = userDocuments.get(0);

        // Get the reference to the user document for using the UPDATE method
        DocumentReference userRef = userSnapshot.getReference();
    
        // Create a Map with the fields that need to be updated
        Map<String, Object> changes = new HashMap<>();
        changes.put("username", updatedUser.getUsername());
        // changes.put("email", updatedUser.getEmail());
        changes.put("phoneNumber", updatedUser.getPhoneNumber());
        changes.put("nationality", updatedUser.getNationality());
        changes.put("age", updatedUser.getAge());
    
        // Perform the update on the specific user document
        ApiFuture<WriteResult> writeResult = userRef.update(changes);
        
        // Block until the update completes (synchronous)
        writeResult.get();
    
        return "User profile updated successfully.";
    }


    // NOT TESTED ***
    public String createUserProfile(User newUser) throws InterruptedException, ExecutionException {
        System.out.println("Creating User profile...");
    
        // Reference the User collection
        CollectionReference usersRef = firestore.collection("User");
    
        // Create a Map with the fields for the new user profile
        Map<String, Object> newUserProfile = new HashMap<>();
        newUserProfile.put("uid", newUser.getUid()); // Use the provided UID
        newUserProfile.put("username", newUser.getUsername());
        newUserProfile.put("phoneNumber", newUser.getPhoneNumber());
        newUserProfile.put("nationality", newUser.getNationality());
        newUserProfile.put("age", newUser.getAge());
        newUserProfile.put("email", newUser.getEmail());
        newUserProfile.put("name", newUser.getName());
        newUserProfile.put("elo", newUser.getElo());
    
        // Create a new document with a randomly generated document ID
        ApiFuture<DocumentReference> writeResult = usersRef.add(newUserProfile);  // `add()` generates a random ID
        
        // Block until the creation completes (synchronous)
        writeResult.get();
    
        return "User profile created successfully with a new document ID.";
    }


}
