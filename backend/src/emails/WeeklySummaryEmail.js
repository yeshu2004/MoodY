import React from "react";
import { Html, Head, Preview, Body, Container, Text } from "@react-email/components";

const WeeklySummaryEmail = ({ user, mostCommonMood, streak, quote })=>{
    return(
        <Html>
            <Head/>
            <Preview>Weekly Mood Summary for {user.name}!</Preview>
            <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
                <Container>
                    <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Hello {user.name}, here’s your Weekly Mood Summary! 😊
                    </Text>
                    <Text>This week, your most frequent mood was **{mostCommonMood}**.</Text>
                    <Text>Your mood streak: **{streak}** days!</Text>
                    <Text>Here’s a quote to reflect on:</Text>
                    <Text style={{ fontStyle: "italic", color: "#4CAF50" }}>
                        "{quote}"
                    </Text>
                    <Text>See you next week! Stay mindful. 😊</Text>
                </Container>
            </Body>
        </Html>
    )
}