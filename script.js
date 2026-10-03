// Get all needed DOM elements 
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const goalMessage = document.getElementById("goalMessage");
const attendeeList = document.getElementById("attendeeList");
const emptyAttendeeList = document.getElementById("emptyAttendeeList");

const maxCount = 50;
const savedAttendance = JSON.parse(localStorage.getItem("attendanceCounts") || "{}");
let count = parseInt(savedAttendance.count, 10) || 0;
const attendees = Array.isArray(savedAttendance.attendees) ? savedAttendance.attendees : [];
const teamCounts = {
  water: parseInt(savedAttendance.water, 10) || 0,
  zero: parseInt(savedAttendance.zero, 10) || 0,
  power: parseInt(savedAttendance.power, 10) || 0
};

attendeeCount.textContent = count;
progressBar.style.width = `${Math.round((count / maxCount) * 100)}%`;
document.getElementById("waterCount").textContent = teamCounts.water;
document.getElementById("zeroCount").textContent = teamCounts.zero;
document.getElementById("powerCount").textContent = teamCounts.power;

function renderAttendees() {
  attendeeList.textContent = "";
  emptyAttendeeList.hidden = attendees.length > 0;

  for (let index = 0; index < attendees.length; index++) {
    const attendeeItem = document.createElement("li");
    attendeeItem.textContent = `${attendees[index].name} — ${attendees[index].teamName}`;
    attendeeList.appendChild(attendeeItem);
  }
}

renderAttendees();

function saveAttendance() {
  localStorage.setItem("attendanceCounts", JSON.stringify({
    count: count,
    water: teamCounts.water,
    zero: teamCounts.zero,
    power: teamCounts.power,
    attendees: attendees
  }));
}

function showGoalCelebration() {
  const teamCounters = [
    document.getElementById("waterCount"),
    document.getElementById("zeroCount"),
    document.getElementById("powerCount")
  ];
  let highestTeamCount = 0;
  let winningTeams = [];

  for (let index = 0; index < teamCounters.length; index++) {
    const currentTeamCount = parseInt(teamCounters[index].textContent, 10);

    if (currentTeamCount > highestTeamCount) {
      highestTeamCount = currentTeamCount;
      winningTeams = [teamCounters[index]];
    } else if (currentTeamCount === highestTeamCount) {
      winningTeams.push(teamCounters[index]);
    }
  }

  const winningTeamNames = [];

  for (let index = 0; index < winningTeams.length; index++) {
    const teamCard = winningTeams[index].parentElement;
    teamCard.classList.add("winning-team");
    winningTeamNames.push(teamCard.querySelector(".team-name").textContent);
  }

  goalMessage.textContent = `🎉 Attendance goal reached! Winning team${winningTeamNames.length > 1 ? "s" : ""}: ${winningTeamNames.join(", ")}!`;
  goalMessage.hidden = false;
}

if (count === maxCount) {
  showGoalCelebration();
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);
  attendees.push({
    name: name,
    teamName: teamName
  });
  renderAttendees();

  //Increment count 
  count++;
  console.log("Total check-ins: ", count);
  attendeeCount.textContent = count;

  // Update progress bar 
  const percentage = Math.round((count / maxCount) * 100) + "%"; 
  progressBar.style.width = percentage;
  console.log(`Progress: ${percentage}`);

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;
  teamCounts[team]++;
  saveAttendance();

  if (count >= maxCount) {
    showGoalCelebration();
  }

  // Show welcome message
  const message = `Welcome, ${name} from ${teamName}`;
  greeting.textContent = message;
  greeting.className = "success-message";
  greeting.style.display = "block";

  form.reset();

  
});