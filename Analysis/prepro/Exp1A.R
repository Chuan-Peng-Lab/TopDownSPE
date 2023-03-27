library(tidyverse)
library(jsonlite)

df <- read.csv("./rawdata/exp1A_.csv")
df %>%
  group_by(condition) %>%
  summarise(avg = mean(rt, na,rm = TRUE))
df$subj_idx <- jsonlite::fromJSON(df$response[5])$Q0
df$gender <- jsonlite::fromJSON(df$response[6])
df$year <- jsonlite::fromJSON(df$response[7])$Q0
df$education <- jsonlite::fromJSON(df$response[8])$Q0
df$dist <- df$view_dist_mm[9]
df2 <- df %>% 
  select(subj_idx, gender, year, education, dist, rt, correct_response, 
         correct, key_press, Image, word, condition, trial_type) %>% 
  dplyr::filter(trial_type == "psychophysics" & condition != "prac")

df2$subj_idx <- as.numeric(df2$subj_idx)
df3 <- df2 %>% 
  mutate(
    matchness =
      case_when(
        subj_idx %% 2 == 1 & correct_response == "j" ~ "match",
        subj_idx %% 2 == 1 & correct_response == "f" ~ "mismatch", #还应过滤掉填充试次
        subj_idx %% 2 == 0 & correct_response == "f" ~ "match",
        subj_idx %% 2 == 0 & correct_response == "j" ~ "mismatch" #还应过滤掉填充试次
      )
  )
df3 %>% 
  count(Image, matchness)
df3$rt <- as.numeric(df3$rt)
df3 <- df3 %>%
  dplyr::filter(Image != "img/T_ambi40.png") #过滤掉填充试次
df4 <- df3 %>%
  select(rt,matchness) %>%
  group_by(matchness) %>%
  summarise(n = n(),
            rt_avg = mean(rt, na.rm = TRUE)
  ) %>%
  ungroup() 