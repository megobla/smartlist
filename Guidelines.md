**Add your own guidelines here**
<!--

# Layout Guidelines - SmartListUse this document to define how layouts are designed and implemented across the SmartList project.## Principles**Consistency**: Maintain uniform spacing, typography, and component patterns throughout the app**Clarity**: Prioritize readability and visual hierarchy with generous whitespace**Accessibility**: Ensure WCAG 2.1 AA compliance with proper contrast, focus states, and touch targets**Responsiveness**: Mobile-first design optimized for one-handed use while shopping

## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
  
  ## Grid System
 - **Column count**:   
  - Mobile (sm): 4 column  
  - Tablet (md): 6-8 columns  
  - Desktop (lg+): 12 columns
  
- **Gutters**: 
  - Desktop (lg+): 20px between columns
  - Tablet (md): 20px between columns  
  - Mobile (sm): 16px between columns
**Margins**:   
 - Mobile (sm): 16px horizontal  
 - Tablet (md): 24px horizontal  
 - Desktop (lg+): 32-48px horizontal
**Container widths**:  
 - Mobile (sm): 100% (with margins)  
 - Tablet (md): 1024px max  
 - Desktop (lg+): 1440px max
 
 ## Spacing Scale
 **Spacing Tokens: 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 72px, 80px, 96px, 128px, 160px, 192px, 224px, 256px
 **Vertical spacing rules**:  
 - Section separation: 40px  
 - Component groups: 16px  
 - Related items: 16px  
 - Tight grouping: 8px
 **Horizontal spacing rules**:  
 - Icon to label: 8px  
 - Card padding: 16px

 ## Typography Rules
 **Base font size**: 16px
 **Font family**  
 - Primary: Raleway  
 - Secondary: Open Sans
 
 **Type scale** 
 - Desktop:  
  - H1: 40px
  - H2: 24px
  - H3: 20px
  - H4: 16px  
  - Body lg: 20px  
  - Body md: 16px  
  - Body sm: 14px 

 - Mobile:  
 - H1: 32px  
 - H2: 24px  
 - H3: 20px
  - H4: 16px  
  - Body lg: 20px  
  - Body md: 16px  
  - Body sm: 14px
  
  - **Line-height**:   
  - H1: 48
  - H2: 32
  - H3: 24
  - H4: 24
  - lg: 24
  - md: 24
  - sm: 24
  
  - **Font weights**:  
  - Heading (H1, H2, H3): Semibold
  - Heading (H4): Regular  
  - Body (lg, md, xs): regular

- **Letter spacing**:
Apply only to H4  
- H4: 8%

- **Type settings: case**:
Apply only to H4  
- H4: Uppercase

## Breakpoints
- **sm** (mobile): 0-639px 
- Optimized for one-handed use
- **md** (tablet): 640-1024px
- **lg** (small desktop): 1024-1440px
- **xl** (desktop): 1440px 
- Max-width container, centered layout
- **2xl** (large desktop): 1920px centered layout

**Layout behavior per breakpoint**:
- **sm**: Stack all content vertically, full-width cards
- **md**: Stack all content vertically. Side-by-side inputs for cards content
- **lg, xl, 2xl**: 12 column grid

## Color System
- **Green**
- green-50: #E6F4F3
- green-100: #C5E9E6
- green-200: #9ED9D3
- green-300: #6EC1B9
- green-400: #47A6A0
- green-500: #115D5B
- green-600: #0F5251
- green-700: #0C4443
- green-800: #083735
- green-900: #052A28

- **Light green**
- light-green-100: #EAF6DA
- light-green-400: #C5E99F

- **Greyscale**
- greyscale-50: #FFFFFF
- greyscale-100: #F9FAFA
- greyscale-200: #F1F3F3
- greyscale-300: #E3E6E6
- greyscale-400: #CBD0D0
- greyscale-500: #A7AEAE
- greyscale-600: #757C7C
- greyscale-700: #4C5353
- greyscale-800: #2F3535
- greyscale-900: #000000

- **Error**
- red-50: #FF6666
- red-100: #DA0707
- red-200: #990000

### Color System guidelines
- **Background**: Greyscale-50 (background color)
- **Primary color**: green-500 (primary button)
- **Secondary color**: light-green-400 (Checkbox active states, secondary button hover)
- **Text**: Greyscale-900 (High contrast. Heading)
- **Secondary text**: Greyscale-800 (body. Lower priority information)
- **cards**: greyscale-50 (cards background. No shadow)
- **Borders**: Greyscale-200 (card outlines, secondary button outline) Greyscale-300 (dividers, checkbox default state outline)

## Accessibility
- **DON'T let AI do this**:
- <div onClick> without role="button" and keyboard handlers
- disabled without aria-disabled
- Icon-only buttons without aria-label
- Focus styles that are "outline: none" only

- **DO enforce this**:
- Semantic HTML (<button>, not <div>)
- Both disabled AND aria-disabled="true"
- aria-label on all icon-only buttons
- Visible focus indicator (never remove without replacement)

## Components and Layout Patterns
### Page Shell
- **Header**:   
- Contains logo, headings, and “add item” as primary button. Vertically aligned
- **Navigation**:   
- No top navigation
- **Content area**:   
- Scrollable region  
- cards stacked vertically. Divided by category
- **Footer**:   
- Fixed bottom position on all breakpoints for constant access
  - Background: solid green-500  
  - Padding: 20px - 16px (mobile), 64px - 15px (tablet), 80px - 16px (desktop)
  
  ### Cards
- **sizes: 2xl, xl, lg, md**:
- 16px border-radius  
- Outline: 2px greyscale-200  
- Padding: 16px
  - No shadow
  - Checkbox: refer to icon in the design
### Buttons
- **Primary Button**:
  - Height: 48px minimum  
  - Border-radius: 128px  
  - Padding: 20px 12px
  - Center-aligned text with 8px gap between label and icon
  - Default state: solid Green-500  
  - Hover state: solid Green-700

- **Secondary Button**:
  - Height: 48px minimum  - Border-radius: 128px  - Padding: 20px 12px
  - Center-aligned text with 8px gap between label and icon
  - Default state: solid Greyscale-50 with 2px outline with 2px outlineGreyscale-300   - Hover state: solid Green-700 with 2px outline Green-700
### Input fields- **Input fields default state**:
  - Height: 48px minimum  
  - Border-radius: 128px  
  - Padding: 20px 12px
  - Left-aligned text with space-between gap between label and icon
  - Default state: solid Greyscale-100 with 2px outline Greyscale-300   
  - Hover state: solid Greyscale-200 with 2px outline Greyscale-300 
  - Active state: solid Greyscale-100 with 2px outline Greyscale-900 
  - **Quantity/price inputs**:  
  - Number input type with step controls
  
  ### Modals
  - **Overlay**: rgba(0, 0, 0, 0.4) backdrop
  - **Modal container**:  
  - Mobile: Centered, width 100%  
  - Desktop: Centered, max-width 480px  
  - Border-radius: 16px   
  - Padding: 24px
  
  ## Implementation Notes### CSS Architecture
  - **Approach**: Utility-first with BEM for complex components
  - **Framework consideration**: Tailwind CSS or custom utility classes
  - **Component styles**: Scoped with CSS Modules or styled-components
  
  ### Naming Conventions
  - **BEM format**: Atomic / Utility-first
  - **Example**: ‘text-sm’ or ‘bg-green-500’
  - **Utility classes**: Prefix with `u-` (e.g., `u-margin-top-16`)
  - **Layout classes**: Prefix with `l-` (e.g., `l-container`, `l-grid`)
  
  ### Spacing Tokens:
  ```css
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px; 
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 40px;
  --space-3xl: 48px;
  --space-4xl: 64px;
  --space-5xl: 72px;
  --space-6xl: 80px; 
  --space-7xl: 96px; 
  --space-8xl: 128px;
  --space-9xl: 160px;   
  --space-10xl: 192px; 
  ```

-->
