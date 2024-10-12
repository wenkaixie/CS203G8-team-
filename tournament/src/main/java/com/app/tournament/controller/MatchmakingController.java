package com.app.tournament.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.tournament.DTO.RoundMatchDTO;
import com.app.tournament.service.MatchmakingService;

@RestController
@RequestMapping("/api/tournaments")
public class MatchmakingController {

    @Autowired
    private MatchmakingService matchmakingService;

    // Endpoint to generate pairings for a specific round in a tournament
    @PostMapping("/{tournamentId}/rounds/{roundNumber}/pairings")
    public List<RoundMatchDTO> createPairingsForRound(@PathVariable String tournamentId, @PathVariable int roundNumber)
            throws Exception {
        return matchmakingService.createPairingsForRound(tournamentId, roundNumber);
    }
}