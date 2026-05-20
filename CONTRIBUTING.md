# Contributing to AffiliateDonor

Thank you for your interest in contributing to AffiliateDonor! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

- Report bugs and issues
- Suggest new features or enhancements
- Improve documentation
- Submit pull requests with bug fixes or new features
- Help with design and UX improvements
- Add translations for internationalization

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details** (OS, browser, Node version, etc.)

## 💡 Suggesting Features

Feature requests should include:

1. **Clear description** of the feature
2. **Use case** - why is this feature needed?
3. **Proposed implementation** (if you have ideas)
4. **Mockups or diagrams** (if applicable)

## 🔧 Development Setup

See `SETUP_INSTRUCTIONS.md` for detailed setup guide.

Quick start:
```bash
npm install
npm run dev
```

## 📝 Code Style

### Frontend (TypeScript/React)

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use descriptive variable names
- Add comments for complex logic

Example:
```typescript
// Good
const CauseCard = ({ cause }: { cause: Cause }) => {
  const { name, raised, goal } = cause
  const progress = (raised / goal) * 100
  
  return (
    <Card>
      <h3>{name}</h3>
      <ProgressBar progress={progress} />
    </Card>
  )
}

// Avoid
const CC = (p: any) => <div>{p.n}</div>
```

### Backend (Go)

- Follow Go conventions
- Use meaningful names
- Add error handling
- Write comments for exported functions
- Keep handlers focused

Example:
```go
// GetCause retrieves a cause by ID
func GetCause(c *gin.Context) {
    id := c.Param("id")
    
    cause, err := db.FindCauseByID(id)
    if err != nil {
        c.JSON(404, gin.H{"error": "Cause not found"})
        return
    }
    
    c.JSON(200, cause)
}
```

## 🧪 Testing

Add tests for new features:

### Frontend
```bash
npm run test
```

### Backend
```bash
cd backend
go test ./...
```

## 📋 Pull Request Process

1. **Fork** the repository
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**:
   ```bash
   git commit -m "Add amazing feature"
   ```
   
   Use clear commit messages:
   - `feat: Add crypto payment modal`
   - `fix: Resolve cart calculation bug`
   - `docs: Update API documentation`
   - `style: Format code with prettier`
   - `refactor: Simplify donation logic`

5. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe what changed and why
   - Reference any related issues
   - Add screenshots for UI changes

7. **Code Review**
   - Address review feedback
   - Keep PR focused (one feature/fix per PR)

## ✅ Checklist Before Submitting PR

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings
- [ ] Builds successfully
- [ ] Tested on multiple browsers (for frontend)
- [ ] Added yourself to CONTRIBUTORS.md (optional)

## 🎨 Design Guidelines

- Follow existing design patterns
- Use TailwindCSS utilities
- Maintain consistent spacing and typography
- Ensure accessibility (ARIA labels, keyboard nav)
- Test on mobile devices

## 📚 Documentation

When adding features:
- Update relevant README sections
- Add inline code comments
- Update API documentation
- Add examples if helpful

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Give constructive feedback
- Celebrate successes together

## 💬 Questions?

- Open a GitHub issue for questions
- Join our Discord community
- Email: dev@affiliatedonor.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making AffiliateDonor better! 🎉
