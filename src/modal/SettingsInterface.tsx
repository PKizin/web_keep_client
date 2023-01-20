const TodoLiteral = 'todo'
const DiaryLiteral = 'diary'
const WeeklyLiteral = 'weekly'
type SettingsInterface = typeof TodoLiteral | typeof DiaryLiteral | typeof WeeklyLiteral | null

export { TodoLiteral, DiaryLiteral, WeeklyLiteral }
export type { SettingsInterface }
