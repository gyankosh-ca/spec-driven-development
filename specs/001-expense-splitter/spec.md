# Feature Specification: Expense Splitter

**Feature Branch**: `001-expense-splitter`

**Created**: 2026-10-20

**Status**: Clarified

**Input**: User description: "An expense splitter for a group of friends. Anyone can create a group and add the people in it. Members record what they paid and who it was for; each expense is split equally between the people it was for. A balances page shows, for every member, how much they are owed or owe."

## Clarifications

### Session 2026-10-20

- Q: When an amount does not divide evenly, who gets the leftover cents? → A: One extra cent each to the people the expense was for, in the order they were added to the group, so the shares add up to the exact total.
- Q: Can a member be removed from a group? → A: Only if they are in no expense. Otherwise removing them is refused with a message saying why.
- Q: Which currency? → A: One currency per group, chosen when the group is created. No conversion between currencies.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start a group (Priority: P1)

Someone creates a group for a trip or a shared flat, names it, picks its currency and adds the people in it.

**Why this priority**: Nothing else works without a group and its members.

**Independent Test**: Create a group called "Lisbon trip" in EUR with Asha, Ben and Chen, and see all three listed on the group's page.

**Acceptance Scenarios**:

1. **Given** no groups exist, **When** a user creates "Lisbon trip" with currency EUR, **Then** the group's page shows the name "Lisbon trip", the currency EUR and no members.
2. **Given** the group "Lisbon trip", **When** the user adds Asha, Ben and Chen, **Then** the members are listed in that order.
3. **Given** the group already has a member called Ben, **When** the user adds another member called "ben", **Then** it is refused with the message "Ben is already in this group".

---

### User Story 2 - Record an expense (Priority: P2)

A member records something they paid for: what it was, the amount, who paid and who it was for. By default it is for everyone in the group.

**Why this priority**: Recording expenses is the reason the group exists; balances are calculated from them.

**Independent Test**: Record "Dinner", 90.00 EUR, paid by Asha for Asha, Ben and Chen, and see it in the group's expense list with each person's share of 30.00.

**Acceptance Scenarios**:

1. **Given** the group "Lisbon trip" with Asha, Ben and Chen, **When** Asha records "Dinner" for 90.00 for all three, **Then** the expense list shows "Dinner", 90.00, paid by Asha, with a share of 30.00 each.
2. **Given** the same group, **When** Ben records "Taxi" for 10.00 for all three, **Then** the shares are 3.34 for Asha, 3.33 for Ben and 3.33 for Chen, and they add up to 10.00.
3. **Given** the same group, **When** someone records an expense for 0.00 or less, **Then** it is refused with the message "Enter an amount greater than zero".
4. **Given** the same group, **When** someone records an expense for nobody, **Then** it is refused with the message "Choose at least one person this was for".

---

### User Story 3 - See who owes whom (Priority: P3)

Any member opens the balances page and sees, for each person, how much they are owed (paid more than their share) or owe (paid less).

**Why this priority**: This is the answer the group came for, but it only means something once expenses exist.

**Independent Test**: With the "Dinner" and "Taxi" expenses above recorded, open the balances page and check every figure.

**Acceptance Scenarios**:

1. **Given** only "Dinner" (Asha paid 90.00 for all three), **When** the balances page is opened, **Then** it shows Asha is owed 60.00, Ben owes 30.00 and Chen owes 30.00.
2. **Given** "Dinner" and "Taxi" are both recorded, **When** the balances page is opened, **Then** it shows Asha is owed 56.66, Ben owes 23.33 and Chen owes 33.33.
3. **Given** any set of expenses, **When** the balances page is opened, **Then** the amounts owed and the amounts owing add up to exactly the same total.
4. **Given** a group with no expenses, **When** the balances page is opened, **Then** every member shows 0.00.

---

### Edge Cases

- An amount that does not divide evenly: the leftover cents go one each to the people the expense was for, in the order they joined the group.
- An expense for one person who is also the payer: recorded, and it changes no balance.
- Removing a member who is in an expense: refused with "Ben is in 2 expenses, so can't be removed".
- An amount with more than two decimal places, such as 10.005: refused with "Enter an amount to the cent, like 10.05".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to create a group with a name and one currency.
- **FR-002**: Users MUST be able to add members to a group; member names MUST be unique within the group, ignoring case.
- **FR-003**: Users MUST be able to record an expense with a description, an amount greater than zero to the cent, one payer and one or more people it was for (all members by default).
- **FR-004**: The system MUST split each expense equally between the people it was for, giving leftover cents one each to those people in the order they joined, so the shares add up to the exact amount.
- **FR-005**: The system MUST show each member's balance: what they paid minus the sum of their shares.
- **FR-006**: Balances MUST add up to exactly zero for every group, after every change.
- **FR-007**: The system MUST refuse to remove a member who is the payer of, or one of the people in, any expense.
- **FR-008**: The system MUST keep groups, members and expenses when the app is restarted.

### Key Entities

- **Group**: a name and a currency; has members and expenses.
- **Member**: a name, unique within the group, and the order they joined.
- **Expense**: a description, an amount, the member who paid, and the members it was for.
- **Share**: one member's part of one expense.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For every group, the balances add up to exactly 0.00, with no rounding difference, after any sequence of expenses.
- **SC-002**: A new user can create a group of four and record three expenses in under 3 minutes without instructions.
- **SC-003**: Every acceptance scenario above passes as an automated test.

## Assumptions

- One currency per group; amounts are entered and shown to the cent.
- No accounts or sign-in: anyone with the app open can use every group. Sign-in is out of scope.
- Splitting by shares or exact amounts, and settling up, are later features.
