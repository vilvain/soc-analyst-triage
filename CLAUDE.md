# Claude Development Guidelines

## Purpose
This document contains instructions for Claude to follow when working on this project to maximize efficiency and minimize token usage.

## Core Efficiency Rules

### File Operations
1. **Use `str_replace` for edits** - Never recreate entire files for small changes
2. **Show changes only** - Only output the modified sections, not entire files
3. **Targeted viewing** - Use `view_range` parameter when reading large files
4. **Read only when necessary** - Don't re-read files you've already seen in the conversation

### Code Standards
1. **Maximum 50 lines per function**
2. **Maximum 800-1000 lines per file**
3. **Split large files** into logical modules/components
4. **Minimal comments** - Only for complex logic that isn't self-explanatory
5. **Concise variable names** - Descriptive but not verbose

### Response Format
1. **Minimal explanations** - Focus on implementation over commentary
2. **No verbose preambles** - Get straight to the code/changes
3. **Batch operations** - Combine multiple small changes into single operations
4. **Avoid repetition** - Don't repeat context or explanations already established

## Example Workflows

### ✅ GOOD: Editing HTML Table Columns
```
User: "Change table columns X, Y, Z to A, B, C"
Claude: [Uses str_replace 3 times, one for each column header]
Output: ~200 tokens
```

### ❌ BAD: Editing HTML Table Columns
```
User: "Change table columns X, Y, Z to A, B, C"
Claude: [Recreates entire HTML file with explanations]
Output: ~3000 tokens
```

### ✅ GOOD: Adding a Function
```
User: "Add function to validate email"
Claude: [Creates new function, shows where to place it]
Output: ~300 tokens
```

### ❌ BAD: Adding a Function
```
User: "Add function to validate email"
Claude: [Shows entire file with new function + lengthy explanation]
Output: ~2000 tokens
```

## Project-Specific Instructions

### When Asked to Modify Code
1. Identify the minimal change needed
2. Use `str_replace` to make targeted edits
3. Confirm the change without recreating the file
4. Only show the changed section(s)

### When Asked to Create New Code
1. Keep functions under 50 lines
2. If a file would exceed 800 lines, suggest splitting it
3. Use existing patterns and structures from the project
4. Provide minimal but sufficient context

### When Asked to Debug
1. Request specific error messages/behavior
2. Only view relevant code sections
3. Propose fix using `str_replace`
4. Explain only if the issue is non-obvious

### When Asked to Refactor
1. Confirm scope before starting
2. Make changes incrementally
3. Test after each significant change
4. Use `str_replace` for existing files

## Communication Preferences

- **Be direct** - Skip "I'll help you with that" preambles
- **Be concise** - Avoid explaining obvious changes
- **Be precise** - Use exact line numbers and file paths
- **Ask clarifying questions upfront** - Reduce back-and-forth iterations

## File Structure Preferences

```
src/
  ├── components/     # UI components (max 500 lines each)
  ├── utils/          # Helper functions (max 300 lines each)
  ├── services/       # API/data services (max 500 lines each)
  ├── config/         # Configuration files
  └── types/          # Type definitions (if applicable)
```

## When to Ignore These Rules

- **Initial project setup** - Full file creation is necessary
- **Major refactoring** - When structural changes require it
- **User explicitly requests** - Verbose explanations or full file outputs
- **Complex debugging** - When context is crucial for understanding

## Reminder

The goal is to maximize development speed and minimize quota usage while maintaining code quality. When in doubt, ask: "Can I make this change with `str_replace` instead of recreating the file?"

---

**Last Updated:** 2026-01-11
