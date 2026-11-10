# Manual testing script

_[Leer en español](./MANUAL_TESTING.es.md)_

Automated tests catch only part of the problems. This script is for people who use, or want to try, a screen reader, voice control or other assistive technology. You do not need to know how to code.

Each component takes about 10 minutes. Test one component or all of them: every result helps.

## Before you start

1. **Open the test pages.** The site link is in the repository's "About" section on GitHub. Each component has a page at `/test/<name>`, for example `/test/dialog`. Each page shows only the example, with no other content.
2. **Choose what you will test with.** Any of these combinations helps:

   | Assistive technology | Browser | System |
   | --- | --- | --- |
   | NVDA (free) | Chrome or Firefox | Windows |
   | JAWS | Chrome | Windows |
   | VoiceOver (built in) | Safari | macOS |
   | VoiceOver (built in) | Safari | iPhone or iPad |
   | TalkBack (built in) | Chrome | Android |
   | Voice Control (built in) | Safari | macOS or iOS |

   You can also test without a screen reader: only the keyboard, zoom at 400%, or Windows contrast themes. Each one finds different problems.

3. **Write down** your system, browser and assistive technology, with versions if you can.

## Basic commands

Screen readers have many commands. These are enough for this script.

| Action | NVDA / JAWS (Windows) | VoiceOver (Mac) | VoiceOver (iPhone) | TalkBack (Android) |
| --- | --- | --- | --- | --- |
| Turn on | NVDA: <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>. JAWS: open the app | <kbd>Cmd</kbd>+<kbd>F5</kbd> | Settings → Accessibility → VoiceOver | Settings → Accessibility → TalkBack |
| Next / previous item | <kbd>↓</kbd> / <kbd>↑</kbd> | <kbd>Ctrl</kbd>+<kbd>Option</kbd>+<kbd>→</kbd> / <kbd>←</kbd> | Swipe right / left | Swipe right / left |
| Next control | <kbd>Tab</kbd> | <kbd>Tab</kbd> (see the note below) | — | — |
| Activate | <kbd>Enter</kbd> or <kbd>Space</kbd> | <kbd>Ctrl</kbd>+<kbd>Option</kbd>+<kbd>Space</kbd> | Double tap | Double tap |
| Stop speaking | <kbd>Ctrl</kbd> | <kbd>Ctrl</kbd> | Two-finger tap | Two-finger tap |

In Safari on Mac, <kbd>Tab</kbd> skips buttons and links by default. Turn on Safari → Settings → Advanced → "Press Tab to highlight each item on a webpage".

## Checks for every component

Do these on every page, then the steps for the component.

- [ ] **Name.** Every control says what it is for, like "Edit profile, button". Nothing is read only as "button" or "clickable".
- [ ] **State.** If something can be on/off, open/closed or selected, the screen reader says so, and says it again when it changes.
- [ ] **Keyboard.** You can reach and use everything with the keyboard alone, in an order that makes sense.
- [ ] **Visible focus.** When you press <kbd>Tab</kbd>, you can always see where you are.
- [ ] **Zoom.** At 200% and at 400% browser zoom, nothing is cut off and you do not need to scroll sideways to read.
- [ ] **Not only color.** Errors, states and messages are clear without seeing color: there is an icon or text too.
- [ ] **Language.** Texts are short and clear.

## Steps for each component

For each step, write: ✅ works as described, ⚠️ works but something is confusing, or ❌ does not work. Add what you heard or saw.

### Accordion — `/test/accordion`
1. Go through the page by headings. Each question ("How long does shipping take?"…) is a heading and a button.
2. Open one with <kbd>Enter</kbd> or <kbd>Space</kbd>. You hear "expanded", and you can read the answer right after the button.
3. Close it. You hear "collapsed".
4. With all sections closed, search the page for a word from an answer (<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>F</kbd>). In Chrome, the section opens by itself.

### Alert — `/test/alert`
1. Read the page. Each message has its type in words (Information, Done, Warning, Error) and a title like "Payment received".
2. The type is clear without seeing the color.
3. These messages are already on the page when it loads, so the screen reader does not read them out by itself. That is expected.

### Alert dialog — `/test/alert-dialog`
1. Activate "Delete account". You hear the question "Delete your account?" and focus is on "Keep my account", the safe choice.
2. Try to leave the dialog with <kbd>Tab</kbd> or by swiping. You stay inside it.
3. Press <kbd>Escape</kbd>. The dialog closes and focus goes back to "Delete account".
4. Open it again and choose "Delete account". You hear "Account deleted."

### Autocomplete — `/test/autocomplete`
1. Go to the "City" field. You hear its name.
2. Type "Gu". Suggestions appear, and you hear how many there are.
3. Move through them with <kbd>↓</kbd> / <kbd>↑</kbd> and choose one with <kbd>Enter</kbd>. The field has that city.
4. Type a city that is not in the list. Your text stays: you do not have to pick a suggestion.
5. Use the clear button. The field is empty.

### Avatar — `/test/avatar`
1. Move through the first row. You hear "Laura Torres, image", "Mateo Ruiz, image", "Ana Gómez, image" and "Sam Lee, image". You do not hear the initials.
2. Ana Gómez's picture does not load. You see her initials "AG", and you hear the same name.
3. In the "Team" list, you hear each name once (the avatars next to the names are hidden).
4. Tab never stops on an avatar.

### Badge — `/test/badge`
1. Read the "Orders" list. Each order is read with its status as a word: "Order 1042 Shipped".
2. In Windows high contrast, each badge keeps its border, and the status icons have different shapes.

### Breadcrumb — `/test/breadcrumb`
1. In the list of landmarks or regions, you find a navigation called "Breadcrumb".
2. Inside it, you hear a list with 4 items. Home, Store and Phones are links.
3. The last item is read as the current page, and it is not a link.
4. The "›" separators are not read.

### Button — `/test/button`
1. Go through every button. Each one has a clear name. The icon-only button is read as "Settings".
2. The disabled button is read as unavailable (dimmed or disabled).
3. Activate the loading button. You hear "Saving", and you can tell it is busy.

### Carousel — `/test/carousel`
1. Find "Accessibility tips". You hear a carousel with its name, and the first slide, "1 of 3".
2. Press "Next slide". You hear the new slide's content.
3. Press <kbd>Tab</kbd> from "Next slide". You reach only the link of the slide that is shown.
4. "News" changes by itself. Press "Pause": it stops. Move focus inside it: it does not start again until you press "Play".
5. With reduced motion on, "News" does not change by itself.

### Checkbox — `/test/checkbox`
1. "Remember me on this device": you hear its name and whether it is checked.
2. Change it with <kbd>Space</kbd> (or double tap). You hear the new state.
3. The disabled checkbox is read as unavailable.

### Checkbox group — `/test/checkbox-group`
1. When you enter the group, you hear its question: "How should we contact you?".
2. Each option (Email, Text message, Phone call) says whether it is checked.

### Collapsible — `/test/collapsible`
1. "Show order details" says "collapsed".
2. Open it. You hear "expanded" and can read the details right after the button.

### Combobox — `/test/combobox`
1. Go to the "Country" field. You hear its name and the help text "Start typing to filter the list."
2. Type "co". The list shows only matching countries, and you hear how many.
3. Type something that matches nothing. You hear "No results".
4. Choose a country with the arrows and <kbd>Enter</kbd>. The field has that country.
5. Press <kbd>Escape</kbd> while the list is open. The list closes and you stay in the field.

### Context menu — `/test/context-menu`
1. Go to the link "Annual report.pdf". Open its context menu: Shift+F10 or the Menu key on Windows, VO+Shift+M with VoiceOver on Mac, or a long press on a phone.
2. You hear a menu. The arrows move through Open, Rename, Download and Delete.
3. Choose "Rename". The menu closes and you hear "Rename chosen."
4. The button "Actions for Annual report.pdf" opens the same options without a context menu.

### Date picker — `/test/date-picker`
1. "Appointment date" is read with its format, "mm/dd/yyyy", and its value.
2. Type "13/45/2026" and leave the field. You hear an error that says what to type.
3. Activate "Choose date". The calendar opens on March 5, read as "Thursday, March 5, 2026", selected.
4. The arrows move by day and week, and Page Down moves to the next month. You hear the new month.
5. Press Enter on a day. The calendar closes, focus goes back to "Choose date", and the field has the new date.
6. "Date of birth" has no calendar. Your browser can fill it in.

### Dialog — `/test/dialog`
1. Activate "Edit profile". You hear the title "Edit profile" and "Change your name and press Save."
2. You cannot leave the dialog with <kbd>Tab</kbd> or by swiping.
3. Press <kbd>Escape</kbd>. It closes and focus goes back to "Edit profile".
4. Open it again, change the name and press Save. You hear "Profile saved."

### Drawer — `/test/drawer`
1. Activate "Show filters". A panel opens and you hear "Filters".
2. Press <kbd>Escape</kbd> or "Close". It closes and focus goes back to the button.
3. Activate "Order summary". Use "Show more" to make the panel taller. The button says whether it is expanded.
4. You can do everything without swiping or dragging.

### Field — `/test/field`
1. The "Email" field says it is required. On screen you see "(required)".
2. You hear the help text "We only use it to reply to you."
3. Type "abc" and leave the field. You hear the error, and on screen it has an icon, not only red text.

### Fieldset — `/test/fieldset`
1. When you enter "Street and number", you also hear the name of the group: "Delivery address".
2. Each field (Street and number, City, Postal code) has its own name.

### File upload — `/test/file-upload`
1. Go to "Documents". You hear a file button with its name and "PDF or PNG, up to 1 MB each."
2. Open the picker with <kbd>Enter</kbd> or <kbd>Space</kbd>, and choose two PDF files. You hear "2 files added", and they are listed.
3. Choose a file bigger than 1 MB. You hear why it was not added, and the reason is shown under the box.
4. Press "Remove" on the first file. You hear it was removed, and focus goes to the next file.
5. Voice control: say "Click Remove". It works.

### Form — `/test/form`
1. Press the submit button without filling in anything. Focus goes to the first field with an error and you hear the error. You also hear how many fields need attention.
2. Fill in every field and submit. You hear "Message sent. We will reply within 2 days."

### Form error summary — `/test/form-summary`
1. Submit without filling in anything. Focus goes to a box titled "There is a problem", and the screen reader reads it.
2. The box has one link per error. Activating a link moves focus to that field.

### Input — `/test/input`
1. Each field (Phone number, Discount code, Account number) has a name and its help text.
2. On a phone, the keyboard that opens fits the field: numbers for the phone number.

### Link — `/test/link`
1. Read the two sentences. You hear "accessibility notes, link" and "Base UI, link, opens in a new tab".
2. Both links are underlined, and each shows a focus ring when you reach it with <kbd>Tab</kbd>.

### Menu — `/test/menu`
1. Activate "File actions". The menu opens and focus is on the first item.
2. Move with <kbd>↓</kbd> / <kbd>↑</kbd>. "Move (not available)" is read as unavailable.
3. On "Share", press <kbd>→</kbd>. A submenu opens on "Copy link". <kbd>←</kbd> closes it.
4. "Show hidden files" says whether it is checked.
5. Choose "Copy link". The menu closes, focus goes back to "File actions", and you hear "Link copied."

### Menubar — `/test/menubar`
1. You hear a menu bar called "Editor". <kbd>Tab</kbd> enters it once, on "File".
2. <kbd>→</kbd> moves to "Edit" and "View". Each is read as a menu item that has a menu.
3. On "Edit", <kbd>↓</kbd> opens its menu. "Undo (nothing to undo)" is read as unavailable. Choose "Copy": the menu closes and you hear "Copy chosen."
4. Open "File", go to "Export" and press <kbd>→</kbd>. Choose "PDF". You hear "Export as PDF chosen."
5. <kbd>Escape</kbd> closes a menu and focus goes back to its name in the bar.

### Meter — `/test/meter`
1. "Storage used" and "Battery" say their value, for example a percentage.
2. The value is clear without seeing the color.

### Navigation menu — `/test/navigation-menu`
1. In the list of landmarks or regions, you find a navigation called "Store".
2. "Products" says "collapsed". Open it and you can reach Phones, Laptops and Accessories.
3. <kbd>Escape</kbd> closes it and focus goes back to "Products".

### OTP field — `/test/otp-field`
1. Go to "Verification code". You hear the name, "Enter the 6-digit code we sent to your email." and that it is required.
2. Type 6 digits. Each one goes into the next box. Move back with the left arrow: you hear "Digit 2 of 6" and so on.
3. Type a letter. Nothing is entered and you hear "Only numbers are allowed."
4. Paste a 6-digit code into the first box. Every box is filled.
5. Delete some digits and leave the field. You hear an error ("Enter all 6 digits.") and the boxes are invalid.
6. On a phone, receive a code by text message. The keyboard offers to fill it in.

### Pagination — `/test/pagination`
1. In the list of landmarks or regions, you find a navigation called "Pagination", with a list.
2. The links are read as "Previous", "Page 1", "Page 4", "Page 6", "Page 12" and "Next". Page 5 is read as the current page and is not a link.
3. Activate "Next". You hear "Page 6 of 12.", and page 6 becomes the current page.
4. On page 12, there is no "Next".

### Password field — `/test/password-field`
1. Go to "Password". You hear its name, that it is required, "At least 8 characters." and that it is a password field.
2. Type a password and press <kbd>Tab</kbd>. You reach "Show password". Press it: you hear "Your password is shown", and the button now says "Hide".
3. Voice control: say "Click Show". The button works.
4. Type 5 characters and leave the field. You hear the error "Use at least 8 characters."
5. Press "Create account". The password is hidden again.

### Popover — `/test/popover`
1. The button "About delivery times" opens a panel titled "Delivery times".
2. You can read the content and use "Close".
3. <kbd>Escape</kbd> closes it and focus goes back to the button.

### Preview card — `/test/preview-card`
1. With a screen reader, read the sentence. "Base UI" is read as a normal link, and you are not sent into a preview.
2. With the keyboard, Tab to "Base UI". A preview appears after a moment. Press <kbd>Escape</kbd>: it closes and you stay on the link.
3. With a mouse, point at "Base UI", then move onto the preview. It stays open.
4. Zoom to 400%. The preview still fits on the screen.

### Number field — `/test/number-field`
1. "Guests" says its name, that it is required, its value, and "From 1 to 8 people."
2. <kbd>↑</kbd> / <kbd>↓</kbd> change the value by 1. <kbd>Home</kbd> and <kbd>End</kbd> go to 1 and 8.
3. <kbd>Tab</kbd> goes to the next field, not to the − and + buttons. With a touch screen reader you can still reach "Decrease" and "Increase".
4. Delete the value and leave the field. You hear "Enter the number of guests."
5. "Price per night" is read with its currency, like "$80".

### Progress — `/test/progress`
1. "Uploading photo" says how far along it is.
2. "Step 2 of 4" is clear.
3. "Preparing your download" says it is busy, without a number.

### Radio group — `/test/radio-group`
1. When you enter the group, you hear "Delivery speed".
2. The arrow keys move between "Standard" and "Express" and choose the option. The price and days are read with each option.
3. Submit without choosing. You hear "Choose a delivery speed."

### Scroll area — `/test/scroll-area`
1. Press <kbd>Tab</kbd> from the start of the content. You reach "Release notes" and hear its name.
2. Scroll it with the arrow keys, <kbd>Page Down</kbd> and <kbd>End</kbd>. Read all the versions.
3. Press <kbd>Tab</kbd>. You reach "Monthly visits". Scroll it sideways with the arrow keys.
4. "Short note" has nothing to scroll, and <kbd>Tab</kbd> skips it.
5. With a mouse or touch, you can see the scrollbars without hovering.

### Search field — `/test/search-field`
1. Jump to the search landmark. You hear "Search components" and a search field.
2. Type "tab". After a moment you hear "2 results".
3. Press <kbd>Tab</kbd> to "Clear search" and press it. The field is empty and focus is back in it.
4. Type "zzz". You hear "No results", and the page says so in text.

### Select — `/test/select`
1. "Time zone" says its name and the chosen value, or "Choose a time zone".
2. Open the list. Groups like "Americas" are read.
3. Choose with the arrows and <kbd>Enter</kbd>. The list closes and you hear the new value.

### Separator — `/test/separator`
1. Read the card from top to bottom. Between "Account" and "Billing" you hear "separator". You do not hear one before the footer links, or between "Help" and "Privacy".
2. In Windows high contrast, every line is still visible.

### Skeleton — `/test/skeleton`
1. Load the page. After a second you hear "Loading orders", then "Orders loaded" when the list appears.
2. While it loads, reading the area gives "Loading orders", not the grey shapes.
3. Press "Reload". Focus stays on the button while the list loads again.
4. With reduced motion on, the shapes do not pulse.

### Slider — `/test/slider`
1. "Volume" says its value. The arrows change it by 5.
2. "Room temperature" says the value with its unit, like "21 degrees".
3. <kbd>Home</kbd> and <kbd>End</kbd> go to the minimum and maximum. On a phone, swiping up or down (or the volume keys with TalkBack) changes the value.

### Stepper — `/test/stepper`
1. Find the "Checkout steps" navigation. You hear a list of 4 items.
2. "Cart" and "Shipping" are links, read as "Step 1 of 4, completed". "Payment" is read as the current step.
3. Press "Continue". Focus goes to the "Review" heading, and the stepper now shows Review as the current step.
4. At 400% zoom, the steps are in a column and the page does not scroll sideways.

### Switch — `/test/switch`
1. "Email notifications" says whether it is on or off.
2. Change it. You hear the new state, and "Email notifications on." or "off."
3. "Beta features (not available)" is read as unavailable.

### Table — `/test/table`
1. You hear a table called "Recent orders", with its number of rows and columns.
2. Move through the cells with the screen reader's table commands (NVDA/JAWS: <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+arrows; VoiceOver: <kbd>VO</kbd>+arrows). Each cell is read with its column header, and with the order number as its row header.
3. "Customer", "Date" and "Total" are buttons. Press "Customer". You hear "Sorted by Customer, ascending", and the header is read as sorted.
4. At 400% zoom (or on a phone), the page does not scroll sideways. The table scrolls inside its frame, and you can reach the frame with <kbd>Tab</kbd> and scroll it with <kbd>←</kbd> / <kbd>→</kbd>.
5. In "Team members", each row starts with a checkbox called "Select" and the person's name. Check "Select Mateo Ruiz" with <kbd>Space</kbd>. You hear "1 row selected", and "Select all rows" is now partly checked.
6. Check "Select all rows". You hear "3 rows selected".

### Tabs — `/test/tabs`
1. You hear the group "Account settings" and the selected tab.
2. <kbd>←</kbd> / <kbd>→</kbd> move between Profile, Password and Notifications, and show their content.
3. <kbd>Tab</kbd> goes from the tab to its content.

### Textarea — `/test/textarea`
1. "Your feedback" says its name and "Up to 500 characters."
2. While you type, the remaining characters are shown on screen. You hear them only near the end (20, 10 and 0 left), not on every key.

### Toast — `/test/toast`
1. Press "Save". You hear "Changes saved" without losing your place on the page.
2. Show "Message archived". Press <kbd>F6</kbd> to reach the notification and use "Undo". You hear "Message restored", and focus goes back where it was.
3. The error notification ("Upload failed") is read too, with its text.
4. Notifications do not disappear while you are reading them or have focus on them.

### Toggle — `/test/toggle`
1. "Mute notifications" is read as a button that is not pressed. "Bold" is read as pressed.
2. Press "Mute notifications" with <kbd>Space</kbd> (or double tap). You hear "pressed", and the name stays the same.
3. On screen, a pressed toggle is filled and has a bar at the bottom, so you can tell without color.
4. "Autoplay (not available)" is read as unavailable.

### Toggle group — `/test/toggle-group`
1. When you enter the first group, you hear "Text alignment". In the second, "Text style".
2. In "Text alignment", <kbd>←</kbd> / <kbd>→</kbd> move between Left, Center and Right. <kbd>Space</kbd> presses one and releases the others.
3. In "Text style", Bold, Italic and Underline can be pressed at the same time.
4. <kbd>Tab</kbd> leaves the group instead of going through every button.

### Toolbar — `/test/toolbar`
1. You hear a toolbar called "Text formatting". <kbd>Tab</kbd> enters it once, on "Bold".
2. <kbd>→</kbd> moves through Bold, Italic, Left, Center, Undo, Redo and Help, then back to Bold. You hear the groups ("Text style", "Alignment") when you enter them.
3. Bold and Italic say whether they are pressed. "Undo" is read as unavailable but you can still reach it.
4. <kbd>Tab</kbd> leaves the toolbar in one step.

### Tooltip — `/test/tooltip`
1. The icon buttons are read as "Bold" and "Italic".
2. With the keyboard, the tooltip appears when the button has focus. <kbd>Escape</kbd> hides it.
3. Nothing important is only in a tooltip.

## Extra checks without a screen reader

- **Windows contrast themes** (Settings → Accessibility → Contrast themes): buttons, fields, check marks, switches, bars and the focus ring are still visible.
- **Voice Control** (Mac or iPhone): say "Click" and the visible name, like "Click Edit profile". It works on every control.
- **Reduce motion** (system setting): panels and dialogs open without animation.

## Send your results

[Open a test report](https://github.com/jfpanchi/akso-ui/issues/new?template=manual-test-report.yml) on GitHub and paste your notes. If you do not use GitHub, any format is fine: a list of ✅ / ⚠️ / ❌ per step, with your system, browser and assistive technology.

Maintainers: record each result in the "Manual testing" table of that component in [ACCESSIBILITY.md](./ACCESSIBILITY.md).

Thank you. Each report makes the components better for someone.
