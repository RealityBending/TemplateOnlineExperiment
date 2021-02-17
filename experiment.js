/* authenticate github using Octokit -- documentation: https://octokit.github.io/rest.js/v18/ */
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

let authToken;

fetch(".netlify/functions/api")
.then(response => response.json())
.then(json => {
    authToken = json.api;
})

console.log(octokit.users.getAuthenticated());

const octokit = new Octokit({
    auth: authToken, // replace this with your own OAuth token
});

const REPO_NAME = "TemplateOnlineExperiment";
const REPO_OWNER = "penguimelia"; // update this to use "RealityBending"
const AUTHOR_EMAIL = "penguimelia@gmail.com"; // update this to committer/author email
let test = '12345'

octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: `${test}.json`, // path in repo -- saves to 'results' folder as '<participant_id>.json'
        message: `Saving results for participant ${test}`, // commit message
        content: btoa({fart: 'fart'}), // octokit requires base64 encoding for the content; this just encodes the json string
        "committer.name": REPO_OWNER,
        "committer.email": AUTHOR_EMAIL,
        "author.name": REPO_OWNER,
        "author.email": AUTHOR_EMAIL,
    }).then(resp => console.log(resp)).catch(err => console.log(err));

/* INFO ================== */

// generate a random subject ID with 15 characters
var participant_id = jsPsych.randomization.randomID(15)
var date = new Date()
date = "" + date.getFullYear() + date.getMonth() + date.getDay() + date.getHours() + date.getMinutes() + date.getSeconds()
var path = "data/" + date + "_" + participant_id
var time_start = performance.now()

// record the condition assignment in the jsPsych data
// this adds a property called 'participant' to every trial
jsPsych.data.addProperties({
    participant_id: participant_id,
    experiment_version: '0.0.1',
    data_path: path,
    date: Date()
})

jsPsych.data.addProperties(systemInfo())

/* START ================== */



var welcome_screen = {
    type: "html-button-response",
    choices: ["I agree.", "I disagree."],
    stimulus: "\
    <p><b>Welcome to the experiment! Please read the information below.</b></p> \
    <hr> \
    <p><i>Here are the terms and conditions. Blabla something something.</i><p> \
    <p><i>Another paragraph blabla something else.</i><p>",
    on_finish: function (data) {
        // Quit if echap
        if (data.button_pressed == 1) {
            jsPsych.endExperiment('The experiment was ended.')
        }
    }
}

var information_screen_free = {
    type: 'survey-text',
    questions: [
        { prompt: "Enter your birthday", name: 'Age', placeholder: "example: '13121991' for 13/12/1991" },
        { prompt: "Enter your initials", name: 'Initials', placeholder: "example: 'DM'" }
    ],
    data: { object: 'information' }
}


var information_screen_choice = {
    type: 'survey-multi-choice',
    questions: [
        { prompt: "<p><b>Did you already played this game?</b></p>" +
                  "<p><i>This is just for us to know if you're a first timer :)</i></p>",
          name: 'AlreadyPlayed', 
          options: ["No", "Yes"], 
          required: true }
    ],
    data: { object: 'information' }
}


var instructions = {
    type: "html-button-response",
    choices: ["Let's start!"],
    stimulus: "\
    <p>In this experiment, a circle will appear in the center of the screen.</p> \
    <p>If the circle is <strong>blue</strong>, press the letter B on the keyboard as fast as you can.</p> \
    <p>If the circle is <strong>orange</strong>, press the letter O as fast as you can.</p> \
    <div style='width: 100%;'> \
        <div style='float: left;'> \
            <img src='img/blue.png'></img> \
            <p class='small'><strong>Press the <- key</strong></p> \
        </div> \
        <div class='float: right;'> \
            <img src='img/orange.png'></img> \
            <p class='small'><strong>Press the -> key</strong></p> \
        </div> \
    </div> \
    <br><p>Are you ready?</p>"
}


/* STIMULI ================== */

// Stimuli timeline
// data_stimuli = read_json_from_url('https://raw.githubusercontent.com/DominiqueMakowski/jsPsychTemplate/main/stimuli/stimuli.json')
// console.log(data_stimuli)

var timeline_stimuli = [
    {
        stimulus: "stimuli/blue.png",
        data: {
            object: "stimulus",
            correct_key: 'leftarrow',
            correct_button: '<-'
        }
    },
    {
        stimulus: "stimuli/orange.png",
        data: {
            object: "stimulus",
            correct_key: 'rightarrow',
            correct_button: '->'
        }
    }
]

// Create array of images for preload
var list_images = [...timeline_stimuli] // Copy
for (var i in range(timeline_stimuli.length)) {
    list_images[i] = timeline_stimuli[i]["stimulus"]
}

/* TRIALS ================== */
// Screens
var trial_number = 1

var stimulus = {
    type: "image-buttonkeyboard-response",
    stimulus: jsPsych.timelineVariable('stimulus'),  // Use the 'stimulus' value from the timeline
    choices: ['<-', '->'],  // Allowed inputs
    // margin_horizontal: '2em',  // Separation between buttons
    // button_html: ['<button class="jspsych-btn" style = "position:absolute; bottom: 1em, font-size: 3em">%choice%</button>', '<button class="jspsych-btn" style = "position:absolute; bottom: 1em, font-size: 3em">%choice%</button>'],
    keys: ['leftarrow', 'rightarrow', 'esc'],  // Allowed inputs
    data: jsPsych.timelineVariable('data'), // Add the 'data' dict to the data of that trial
    on_finish: function (data) {
        data.prestimulus_duration = jsPsych.data.get().last(2).values()[0].time_elapsed - jsPsych.data.get().last(3).values()[0].time_elapsed
        data.trial_number = trial_number
        trial_number += 1
        data.correct = [data.correct_key, data.correct_button].includes(data.answer) // Correct or not
        // Quit if echap
        if (data.answer == 'esc') {
            jsPsych.endExperiment('The experiment was ended.')
        }
    }
}


var feedback = {
    type: "html-keyboard-response",
    stimulus: function () {
        if (jsPsych.data.get().last(1).values()[0].correct) {
            var last_trial_correct = "<p style='color:green; font-size:2em'><b>Correct!</b></p>"
        } else {
            var last_trial_correct = "<p style='color:red; font-size:2em'><b>Wrong.</b></p>"
        }
        var last_rt = jsPsych.data.get().last(1).values()[0].rt
        return last_trial_correct + "<p>RT: " + round_digits(last_rt) + " ms</p>"
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: 500
}

var trials = {
    timeline: [fixation_cross, stimulus, feedback],
    timeline_variables: timeline_stimuli,
    randomize_order: true,
    repetitions: 2
}



var questionnaire = {
    type: 'html-slider-response',
    stimulus: '<p><b>Overall, did you find this task easy?</b></p>',
    labels: ['Not at all', 'Absolutely'],
    data: { object: 'information' }
}

var end_screen = {
    type: "html-button-response",
    choices: ["Close."],
    stimulus: function () {

        // Debriefing with feedback
        var trials = jsPsych.data.get().filter({ object: 'stimulus' })
        var correct_trials = trials.filter({ correct: true })

        var accuracy = "<p style='color:rgb(76,175,80);'>You responded correctly on <b>" +
            round_digits(correct_trials.count() / trials.count() * 100) + "" +
            "%</b> of the trials.</p>"

        if (correct_trials.count() > 0) {
            var rt = correct_trials.select('rt').mean()
            rt = "<p style='color:rgb(233,30,99);'>Your average response time was <b>" + round_digits(rt) + "</b> ms.</p>"
        } else {
            var rt = ""
        }

        return "<p><b>Thank you for participating!</b> Here are your results:</p><hr>" +
            accuracy + rt +
            "<hr><p> Don't hesitate to spread the word and share this experiment, science appreciates :)</p>"

    },
    data: { object: 'fixation_cross',
            experiment_duration: function() { return performance.now() - time_start }}
}

/* SAVING DATA FUNCTION ================== */

// const REPO_NAME = "TemplateOnlineExperiment";
// const REPO_OWNER = "penguimelia"; // update this to use "RealityBending"
// const AUTHOR_EMAIL = "penguimelia@gmail.com"; // update this to committer/author email

// u can add more constants for author/committer names, etc

function saveToRepo(jsonData, participantId) {
    // commits a new file in defined repo
    octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: 'results/' + participantId + '.json', // path in repo -- saves to 'results' folder as '<participant_id>.json'
        message: `Saving results for participant ${participantId}`, // commit message
        content: btoa(jsonData), // octokit requires base64 encoding for the content; this just encodes the json string
        "committer.name": REPO_OWNER,
        "committer.email": AUTHOR_EMAIL,
        "author.name": REPO_OWNER,
        "author.email": AUTHOR_EMAIL,
    });
}

/* START ================== */

jsPsych.init({
    preload_images: list_images,
    show_progress_bar: true,
    message_progress_bar: 'Completion',
    timeline: [
        welcome_screen,
        information_screen_free,
        information_screen_choice,
        instructions,
        trials,
        questionnaire,
        end_screen
    ],
    on_finish: function () {
        // Save data
        // saveData(jsPsych.data.get().filter({ object: 'stimulus' }).csv(), path + "_trials")
        // saveData(jsPsych.data.getInteractionData().csv(), path + "_Interactions")

        // get the participant ID in the first trial result (they're all the same)
        var participantId = jsPsych.data.get().first(1).values()[0].participant_id;
        var jsonData = jsPsych.data.get().json(true); // get pretty-printed json of data

        saveToRepo(jsonData, participantId);

        // Display data
        jsPsych.data.displayData()
    }
})


