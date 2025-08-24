# Resend Email Templates

This directory contains the email template system for the Delmarva site, built on top of Resend's template functionality.

## Overview

The template system provides:
- **Professional HTML email templates** with responsive design
- **Template variable replacement** for dynamic content
- **Programmatic template management** via the Resend API
- **Consistent branding** across all emails

## Templates

### 1. Join Our Team Notification Template
- **Name**: `join-our-team-notification`
- **Purpose**: Sent to Delmarva team when someone applies for a job
- **Variables**: All form fields including name, email, position, etc.

### 2. Join Our Team Confirmation Template
- **Name**: `join-our-team-confirmation`
- **Purpose**: Sent to applicants confirming their application was received
- **Variables**: name, position

## Usage

### Setting Up Templates

1. **First time setup**:
   ```bash
   pnpm run setup-resend-templates
   ```

2. **Manual setup via Resend Dashboard**:
   - Go to [Resend Templates](https://resend.com/templates)
   - Create templates with the names above
   - Copy the HTML/text content from the template files

### Using Templates in Code

```typescript
import { JOIN_OUR_TEAM_TEMPLATE } from 'src/lib/resendTemplates';
import { replaceTemplateVariablesInObject } from 'src/lib/templateUtils';

// Replace variables in template
const emailContent = replaceTemplateVariablesInObject(
  JOIN_OUR_TEAM_TEMPLATE,
  {
    name: 'John Doe',
    email: 'john@example.com',
    position: 'Frontend Developer',
    // ... other variables
  }
);

// Send email with processed template
await resend.emails.send({
  from: 'Delmarva <hello@delmarvasite.com>',
  to: 'team@delmarvasite.com',
  subject: emailContent.subject,
  html: emailContent.html,
  text: emailContent.text,
});
```

### Template Management Functions

```typescript
import { createTemplate, getTemplate, listTemplates, deleteTemplate } from 'src/lib/resendTemplates';

// Create a new template
await createTemplate(templateData);

// Get a template by name
const template = await getTemplate('template-name');

// List all templates
const templates = await listTemplates();

// Delete a template
await deleteTemplate('template-id');
```

## Template Variables

All templates use the `{{variableName}}` syntax for dynamic content:

- `{{name}}` - Applicant's full name
- `{{email}}` - Applicant's email address
- `{{phone}}` - Phone number
- `{{position}}` - Job position applied for
- `{{briefDescription}}` - Application message
- `{{workEligibility}}` - Work eligibility status
- `{{address}}`, `{{city}}`, `{{state}}`, `{{zipCode}}` - Address information
- `{{coverLetter}}` - Cover letter content
- `{{resume}}` - Resume information

## Customization

### Adding New Templates

1. Create a new template object in `resendTemplates.ts`:
   ```typescript
   export const NEW_TEMPLATE: EmailTemplate = {
     name: "template-name",
     subject: "Email Subject - {{variable}}",
     html: `<!DOCTYPE html>...`,
     text: `Plain text version...`
   };
   ```

2. Add it to the setup script in `scripts/setup-resend-templates.js`

3. Use it in your email sending logic

### Modifying Existing Templates

1. Update the template content in `resendTemplates.ts`
2. Re-run the setup script to update the template in Resend
3. Or manually update via the Resend dashboard

## Best Practices

- **Mobile-first design**: All templates are responsive
- **Accessibility**: Include both HTML and text versions
- **Branding consistency**: Use consistent colors, fonts, and styling
- **Variable validation**: Always check that required variables are provided
- **Error handling**: Gracefully handle missing template variables

## Troubleshooting

### Template Not Found
- Check that the template name matches exactly
- Verify the template was created successfully
- Use the setup script to recreate templates

### Variables Not Replacing
- Ensure variable names match exactly (case-sensitive)
- Check that the variable object contains the expected keys
- Verify template syntax uses `{{variableName}}` format

### Email Not Sending
- Check Resend API key configuration
- Verify template IDs are correct
- Check Resend dashboard for any errors
