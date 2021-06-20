const categoriesList = [
  {
    name: "G",
    description:
      "All ages admitted. Nothing that would offend parents for viewing by children.",
    alias: "General Audiences",
    type: "rating",
  },
  {
    name: "PG",
    description: `Some material may not be suitable for children. Parents urged to give 'parental guidance'. May contain some material parents might not like for their young children.`,
    alias: "Parental Guidance Suggested",
    type: "rating",
  },
  {
    name: "PG-13",
    description:
      "Some material may be inappropriate for children under 13. Parents are urged to be cautious. Some material may be inappropriate for pre-teenagers.",
    alias: "Parents Strongly Cautioned",
    type: "rating",
  },
  {
    name: "R",
    description:
      "Under 17 requires accompanying parent or adult guardian. Contains some adult material. Parents are urged to learn more about the film before taking their young children with them.",
    alias: "Restricted",
    type: "rating",
  },
  {
    name: "NC-17",
    description:
      "No One 17 and Under Admitted. Clearly adult. Children are not admitted.",
    alias: "Adults Only",
    type: "rating",
  },
  {
    name: "News",
    type: "post",
  },
  {
    name: "Review",
    type: "post",
  },
  {
    name: "Analyst",
    type: "post",
  },
  {
    name: "user",
    type: "user",
  },
  {
    name: "reporter",
    type: "user",
  },
  {
    name: "pro",
    type: "user",
  },
  {
    name: "admin",
    type: "user",
  },
  {
    name: "s-admin",
    type: "user",
  },
  {
    name: "Action",
    description: `An action story is similar to adventure, and the protagonist usually takes a risky turn, which leads to desperate situations (including explosions, fight scenes, daring escapes, etc.). Action and adventure are usually categorized together (sometimes even as 'action-adventure') because they have much in common, and many stories fall under both genres simultaneously (for instance, the James Bond series can be classified as both).`,
    type: "genre",
  },
  {
    name: "Adventure",
    description: `An adventure story is about a protagonist who journeys to epic or distant places to accomplish something. It can have many other genre elements included within it, because it is a very open genre. The protagonist has a mission and faces obstacles to get to their destination. Also, adventure stories usually include unknown settings and characters with prized properties or features.`,
    type: "genre",
  },
  {
    name: "Comedy",
    description: `Comedy is a story that tells about a series of funny, or comical events, intended to make the audience laugh. It is a very open genre, and thus crosses over with many other genres on a frequent basics.`,
    type: "genre",
  },
  {
    name: "Crime and mystery",
    description: `A crime story is often about a crime that is being committed or was committed, but can also be an account of a criminal's life. A mystery story follows an investigator as they attempt to solve a puzzle (often a crime). The details and clues are presented as the story continues and the protagonist discovers them and by the end of the story the mystery is solved. For example, in the case of a crime mystery, the perpetrator and motive behind the crime are revealed and the perpetrator is brought to justice. Mystery novels are often written in series, which facilitates a more in-depth development of the primary investigator.`,
    type: "genre",
  },
  {
    name: "Fantasy",
    description: `A fantasy story is about magic or supernatural forces, as opposed to technology as seen in science fiction. Depending on the extent of these other elements, the story may or may not be considered to be a 'hybrid genre' series; for instance, even though the Harry Potter series canon includes the requirement of a particular gene to be a wizard, it is referred to only as a fantasy series.`,
    type: "genre",
  },
  {
    name: "Historical",
    description: `A story about a real person or event. There are also some fiction works that purport to be the 'memoirs' of fictional characters as well, done in a similar style, however, these are in a separate genre. Often, they are written in a text book format, which may or may not focus on solely that.`,
    type: "genre",
  },
  {
    name: "Horror",
    description: `A horror story is told to deliberately scare or frighten the audience, through suspense, violence or shock. H. P. Lovecraft distinguishes two primary varieties in the 'Introduction' to Supernatural Horror in Literature: 1) Physical Fear or the 'mundanely gruesome;' and 2) the true Supernatural Horror story or the 'Weird Tale.' The supernatural variety is occasionally called 'dark fantasy,' since the laws of nature must be violated in some way, thus qualifying the story as 'fantastic.'`,
    type: "genre",
  },
  {
    name: "Romance",
    description: `In satire, human or individual vices, follies, abuses, or shortcomings are held up to censure by means of ridicule, derision, burlesque, irony, or other methods, ideally with the intent to bring about improvement.`,
    type: "genre",
  },
  {
    name: "Satire",
    description: `An action story is similar to adventure, and the protagonist usually takes a risky turn, which leads to desperate situations (including explosions, fight scenes, daring escapes, etc.). Action and adventure are usually categorized together (sometimes even as 'action-adventure') because they have much in common, and many stories fall under both genres simultaneously (for instance, the James Bond series can be classified as both).`,
    type: "genre",
  },
  {
    name: "Science fiction",
    description: `Science fiction (once known as scientific romance) is similar to fantasy, except stories in this genre use scientific understanding to explain the universe that it takes place in. It generally includes or is centered on the presumed effects or ramifications of computers or machines; travel through space, time or alternate universes; alien life-forms; genetic engineering; or other such things. The science or technology used may or may not be very thoroughly elaborated on.`,
    type: "genre",
  },
  {
    name: "Cyberpunk and derivatives",
    description: `Cyberpunk is a speculative subgenre of scifi that involves stories with a futuristic storyline dealing with people who have been physically or mentally enhanced with cybernetic components, often featuring cyborgs or the singularity as a major theme, and generally somewhat cynical or dystopian (hence the 'punk' portion of the name). This is often confused or placed with techno-thriller, which is actually a separate and less specialized genre.`,
    type: "genre",
  },
  {
    name: "Speculative",
    description: `Speculative fiction speculates about worlds that are unlike the real world in various important ways. In these contexts, it generally overlaps one or more of the following: science fiction, fantasy fiction, horror fiction, supernatural fiction, superhero fiction, utopian and dystopian fiction, apocalyptic and post-apocalyptic fiction, and alternate history.`,
    type: "genre",
  },
  {
    name: "Thriller",
    description: `A thriller is a story that is usually a mix of fear and excitement. It has traits from the suspense genre and often from the action, adventure or mystery genres, but the level of terror makes it borderline horror fiction at times as well. It generally has a dark or serious theme, which also makes it similar to drama.`,
    type: "genre",
  },
  {
    name: "Western",
    description: `Stories in the Western genre are set in the American West, between the time of the Civil war and the early 20th century.The setting of a wilderness or uncivilized area is especially important to the genre, and the setting is often described richly and in-depth. They focus on the adventure of the main character(s) and the contrast between civilization or society and the untamed wilderness, often featuring the characters working to bring civilization to the wilderness.`,
    type: "genre",
  },
  {
    name: "Best Actor",
    description: `Best Actor is the name of an award which is presented by various film, television and theatre organizations, festivals, and people's awards to leading actors in a film, television series, television film or play.`,
    type: "award",
  },
  {
    name: "Best Actress",
    description: `Best Actress is the name of an award which is presented by various film, television and theatre organizations, festivals, and people's awards to leading actresses in a film, television series, television film or play`,
    type: "award",
  },
  {
    name: "Best Adapted Screenplay",
    description: `A "Best Adapted Screenplay" award is generally issued for the best achievement in transferring a written work from another genre, such as a novel or comic book, in whole or in part, to a feature film.`,
    type: "award",
  },
  {
    name: "Best Original Screenplay",
    description: ``,
    type: "award",
  },
  {
    name: "Best Animated Feature Film",
    description: ``,
    type: "award",
  },
  {
    name: "Best Cinematography",
    description: ``,
    type: "award",
  },
  {
    name: "Best Costume Design",
    description: ``,
    type: "award",
  },
  {
    name: "Best Director",
    description: ``,
    type: "award",
  },
  {
    name: "Best Film Editing",
    description: ``,
    type: "award",
  },
  {
    name: "Best Foreign Language Film",
    description: ``,
    type: "award",
  },
  {
    name: "Best Makeup",
    description: ``,
    type: "award",
  },
  {
    name: "Best Picture",
    description: ``,
    type: "award",
  },
  {
    name: "Best Production Design",
    description: ``,
    type: "award",
  },
  {
    name: "Best Original Score",
    description: ``,
    type: "award",
  },
  {
    name: "Best Original Song",
    description: ``,
    type: "award",
  },
  {
    name: "Best Sound",
    description: ``,
    type: "award",
  },
  {
    name: "Best Special Effects",
    description: ``,
    type: "award",
  },
  {
    name: "comment",
    type: "comment",
  },
  {
    name: "post",
    type: "comment",
  },
  {
    name: "noob",
    type: "interact",
  },
  {
    name: "hate",
    type: "interact",
  },
  {
    name: "like",
    type: "interact",
  },
  {
    name: "love",
    type: "interact",
  },
  {
    name: "pro",
    type: "interact",
  },
  {
    name: "lemoncat awards",
    type: "winners",
  },
  {
    name: "oscars",
    type: "winners",
  },
  {
    name: "golden globes",
    type: "winners",
  },
  {
    name: "top by genre",
    type: "best",
  },
  {
    name: "top by year",
    type: "best",
  },
  {
    name: "top by rated",
    type: "best",
  },
  {
    name: "best picture",
    type: "winner categories",
  },
  {
    name: "best original screenplay",
    type: "winner categories",
  },
  {
    name: "best adapted screenplay",
    type: "winner categories",
  },
  {
    name: "best cinematography",
    type: "winner categories",
  },
  {
    name: "best production design",
    type: "winner categories",
  },
  {
    name: "best editing",
    type: "winner categories",
  },
  {
    name: "best original song",
    type: "winner categories",
  },
  {
    name: "best costume design",
    type: "winner categories",
  },
  {
    name: "best sound mixing",
    type: "winner categories",
  },
  {
    name: "best sound editing",
    type: "winner categories",
  },
  {
    name: "best visual effects",
    type: "winner categories",
  },
  {
    name: "best foreign-language film",
    type: "winner categories",
  },
  {
    name: "best animated feature film",
    type: "winner categories",
  },
  {
    name: "best animated short",
    type: "winner categories",
  },
  {
    name: "best live-action short",
    type: "winner categories",
  },
  {
    name: "best documentary feature",
    type: "winner categories",
  },
  {
    name: "best documentary short",
    type: "winner categories",
  },
];

exports.seed = async (knex) => {
  return await knex("categories")
    .del()
    .then(async () => {
      await knex("categories").insert(list);
    });
};
