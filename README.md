# WEB3 Puzzler : Commit Reveal

This is a platform to conduct quizzes and use the commit-reveal scheme to reward the right people.Commit-Reveal scheme requires the player to submit a hash of the answer and his address. Later when the answer is revealed the commit can be used to verify the answer given by the user.

Currently the answers can only be numbers

Frontend pages :

1. /create : Create a puzzle
2. /puzzles : List all puzzles
3. /puzzles/:id : Go to a specific puzzle
4. frontend date and time component for deadlines

Backend :
Use of Supabase(BAAS) for :

1. Storing image of the question(optional)
2. Puzzle title
3. Puzzle description
4. Both Deadlines
