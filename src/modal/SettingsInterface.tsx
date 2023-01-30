const TodoLiteral = 'todo'
const DiaryLiteral = 'diary'
const WeeklyLiteral = 'weekly'
type SettingsInterface = typeof TodoLiteral | typeof DiaryLiteral | typeof WeeklyLiteral

export { TodoLiteral, DiaryLiteral, WeeklyLiteral }
export type { SettingsInterface }
