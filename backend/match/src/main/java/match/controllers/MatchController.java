package match.controllers;

import match.model.MatchModel;
import match.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @GetMapping("/elo/{tournamentID}")
    public Map<String, Integer> getPlayerEloMap(@PathVariable String tournamentID) {
        return matchService.getPlayerEloMap(tournamentID);
    }

    @GetMapping("/seed/{tournamentID}")
    public List<MatchModel> getSeededMatchups(@PathVariable String tournamentID) {
        return matchService.generateSeededMatchups(tournamentID);
    }

    @GetMapping("/roundrobin/{tournamentID}")
    public List<MatchModel> getRoundRobinMatchups(@PathVariable String tournamentID) {
        return matchService.generateRoundRobinMatchups(tournamentID);
    }

    // @PostMapping("/save/{tournamentID}")
    // public String saveMatchups(@PathVariable String tournamentID, @RequestBody List<MatchModel> matchups) {
    //     matchService.saveMatchups(tournamentID, matchups);
    //     return "Matchups saved successfully";
    // }

    @PostMapping("/seedsave/{tournamentID}")
    public ResponseEntity<List<MatchModel>> generateAndSaveSeededMatchups(@PathVariable String tournamentID) {
        List<MatchModel> matchups = matchService.generateSeededMatchups(tournamentID);
        matchService.saveMatchups(tournamentID, matchups);
        return ResponseEntity.ok(matchups);
    }

    @PostMapping("/roundrobinsave/{tournamentID}")
    public ResponseEntity<List<MatchModel>> generateAndSaveRoundRobinMatchups(@PathVariable String tournamentID) {
        List<MatchModel> matchups = matchService.generateRoundRobinMatchups(tournamentID);
        matchService.saveMatchups(tournamentID, matchups);
        return ResponseEntity.ok(matchups);
    }
}
