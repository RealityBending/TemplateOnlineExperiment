library(rjson)


data_path <- "../data/"
data <- data.frame()  # Initialize empty dataframe


# Define Preprocessing functions ------------------------------------------

clean_object <- function(screen) {
  screen[names(screen)[sapply(screen, is.null)]] <- NA
  screen
}

preprocess_session_info <- function(df) {
  names(df) <- tools::toTitleCase(names(df))
  df$Duration_Consent <- df$Rt
  df[c("Button_pressed", "Stimulus", "Screen" ,"Rt", "Internal_node_id", "Time_elapsed", "Trial_index", "Trial_type")] <- NULL
  names(df)[names(df) == "Participant_id"] <- "Participant_ID"
  df
}

preprocess_participant_info_general <- function(df) {
  out <- as.data.frame(rjson::fromJSON(df$responses))
  out$Duration_InfoGeneral <- df$rt
  out
}

preprocess_participant_info_session <- function(df) {
  out <- as.data.frame(rjson::fromJSON(df$responses))
  out$Duration_InfoSession <- df$rt
  out
}

preprocess_trial <- function(df) {
  names(df) <- tools::toTitleCase(names(df))
  df[c("Screen" ,"Internal_node_id", "Time_elapsed", "Trial_index", "Trial_type")] <- NULL
  names(df)[names(df) == "Rt"] <- "RT"
  df
}

# Run the preprocessing ---------------------------------------------------

# Loop through all the files
for(file in list.files(data_path)) {
  # Read JSON
  rawdata <- rjson::fromJSON(file=paste0(data_path, file))

  trials <- data.frame()
  # Loop through all the "screens" (each screen is recorded as a separate list)
  for(screen in rawdata){
    # print(screen$screen)
    screen <- clean_object(screen)

    if(!is.null(screen$screen) && screen$screen == "session_info") {
      sysinfo <- preprocess_session_info(as.data.frame(screen))
    }
    if(!is.null(screen$screen) && screen$screen == "participant_info_general") {
      ppt_info_general <- preprocess_participant_info_general(as.data.frame(screen))
    }
    if(!is.null(screen$screen) && screen$screen == "participant_info_session") {
      ppt_info_session <- preprocess_participant_info_session(as.data.frame(screen))
    }
    if(!is.null(screen$screen) && screen$screen == "stimulus") {
      trials <- rbind(trials, preprocess_trial(as.data.frame(screen)))
    }
    # if(!is.null(screen$screen) && screen$screen == "question_difficulty") {
    #   trials <- rbind(trials, preprocess_trial(as.data.frame(screen)))
    # }
  }

  info <- cbind(sysinfo, ppt_info_general, ppt_info_session)
  data <- rbind(data, cbind(trials, info))
}

write.csv(data, "data.csv", row.names = FALSE)
