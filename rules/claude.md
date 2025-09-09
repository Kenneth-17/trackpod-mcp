# Claude Project Development Rules

## Standard Workflow

### 1. Planning Phase
- **Think through the problem** thoroughly before starting
- **Read the codebase** to understand existing structure and relevant files
- **Write a comprehensive plan** and save it to `projectplan.md`
- The plan should include a **checklist of todo items** that can be marked off as completed

### 2. Plan Verification
- **Check in with the user** before beginning implementation
- Present the plan for **verification and approval**
- Make any necessary adjustments based on feedback

### 3. Implementation Phase
- **Work through todo items** systematically
- **Mark items as complete** as you finish them
- **Provide high-level explanations** of changes made at each step
- Focus on **incremental progress** rather than large changes

### 4. Code Quality Standards
- **Keep all changes simple** - avoid complexity whenever possible
- **Minimize code impact** - each change should affect as little code as possible
- **Prioritize simplicity** above all else in design decisions
- Make **small, focused commits** rather than massive overhauls

### 5. Documentation and Review
- **Add a review section** to `projectplan.md` when work is complete
- Include a **summary of all changes made**
- Document **any other relevant information** for future reference
- Update documentation as needed

## Key Principles

- **Simplicity First**: Every task and code change should be as simple as possible
- **Incremental Progress**: Break large tasks into smaller, manageable pieces  
- **Clear Communication**: Provide explanations at each step
- **Minimal Impact**: Avoid making unnecessary changes to existing code
- **Documentation**: Keep project plans and reviews up to date

## Design System Rules

### Primary Styling: Use globals_css.css
- **ALWAYS use** the pre-built design system in `src/styles/globals_css.css`
- **Font**: Outfit (Google Fonts) - already imported
- **Colors**: Use CSS custom properties (--primary, --secondary, --accent, etc.)
- **Components**: Use pre-built classes (.btn-primary, .card, .input, .badge, etc.)
- **Status indicators**: Use .status-available, .status-busy, .status-offline, .status-break
- **Priority badges**: Use .priority-low, .priority-medium, .priority-high, .priority-urgent
- **Dark mode**: Fully supported with .dark class variants
- **Shadows**: Use custom shadow utilities (.shadow-custom, .shadow-custom-md, etc.)

### Styling Workflow
1. Import and use globals_css.css in main index.css
2. Use pre-built component classes for consistent UI
3. Leverage CSS custom properties for colors and spacing
4. Follow the established design tokens and patterns

## File Structure

- `projectplan.md` - Contains the project plan with todo checklist and final review
- `claude.md` - This file containing the development rules (you are here)

## Workflow Summary

1. 📋 **Plan** → Read codebase, create projectplan.md with todos
2. ✅ **Verify** → Check plan with user before starting
3. 🔨 **Implement** → Work through todos, explain changes
4. 📝 **Review** → Add summary to projectplan.md when complete