export type CheckpointMapping = {
  id: string;
  lessonIds: string[];
};

export const CHECKPOINTS: CheckpointMapping[] = [
  {
    id: "CHECKPOINT_1",
    lessonIds: ["fruits", "vegetables", "food", "kitchen_tools"],
  },
  {
    id: "CHECKPOINT_2",
    lessonIds: ["furniture", "nature", "clothing", "accessories"],
  },
  {
    id: "final_nouns",
    lessonIds: [
      "fruits",
      "vegetables",
      "food",
      "kitchen_tools",
      "furniture",
      "nature",
      "body_parts",
      "family",
      "jobs",
    ],
  },
  {
    id: "final_verbs",
    lessonIds: ["action_verbs", "routines", "chores"],
  },
  {
    id: "final_adj",
    lessonIds: ["emotions", "tastes", "weather", "hair"],
  },
  {
    id: "final_other",
    lessonIds: ["prepositions", "articles"],
  },
];

export function getCheckpointLessons(id: string): string[] {
  return CHECKPOINTS.find((c) => c.id === id)?.lessonIds || [];
}
