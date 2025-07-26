// pages/api/agent/fill-form/route.ts

import { NextRequest, NextResponse } from "next/server";
import { faker } from '@faker-js/faker';

// --- INTERFACES (can be shared from a common types file) ---
interface DOMOperation {
  type: 'click' | 'type';
  role?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
}
interface ElementInfo {
  tagName: string;
  text?: string;
  placeholder?: string;
  name?: string;
  selector: string;
}
interface PageState {
  url: string;
  title: string;
  elements: ElementInfo[];
}
interface FormFillRequest {
  pageState: PageState;
  prompt?: string;
}

// --- PROMPT CREATION ---
function createFormFillPrompt(pageState: PageState): string {
    const inputElements = pageState.elements
        .filter(el => el.tagName === 'input' || el.tagName === 'textarea' || el.tagName === 'select')
        .map(el => {
            let description = `- ${el.tagName}`;
            if (el.name) description += ` (Label: "${el.name}")`;
            if (el.placeholder) description += ` (Placeholder: "${el.placeholder}")`;
            return description;
        }).join('\n');

    return `You are a data entry specialist. Your task is to generate a JSON array of operations to fill out a web form based on its elements.

**RULES:**
1.  Analyze the provided form elements.
2.  For each input field, generate one "type" operation.
3.  Use realistic dummy data. For a field labeled "Username", use a username. For "Email", use an email address. For "Password", use a strong password.
4.  Do not try to click "submit" or "cancel". Only generate operations to fill the fields.
5.  Respond ONLY with a valid JSON array of operations. Do not add any other text or explanation.

**FORM ELEMENTS:**
${inputElements}

**EXAMPLE RESPONSE:**
[
  {"type": "type", "name": "Username", "value": "${faker.internet.userName().toLowerCase()}"},
  {"type": "type", "name": "Email", "value": "${faker.internet.email().toLowerCase()}"},
  {"type": "type", "name": "Password", "value": "${faker.internet.password()}"}
]

Now, generate the JSON array for the provided form elements.`;
}

// --- DUMMY DATA GENERATION ---
const getDummyData = (fieldName: string): string => {
    const lowerCaseName = fieldName.toLowerCase();
    if (lowerCaseName.includes('email')) return faker.internet.email().toLowerCase();
    if (lowerCaseName.includes('first name')) return faker.person.firstName();
    if (lowerCaseName.includes('last name') || lowerCaseName.includes('surname')) return faker.person.lastName();
    if (lowerCaseName.includes('full name')) return faker.person.fullName();
    if (lowerCaseName.includes('user') && lowerCaseName.includes('name')) return faker.internet.userName().toLowerCase();
    if (lowerCaseName.includes('password')) return faker.internet.password({ length: 12, memorable: true, prefix: '!A1' });
    if (lowerCaseName.includes('phone') || lowerCaseName.includes('contact')) return faker.phone.number();
    if (lowerCaseName.includes('city')) return faker.location.city();
    if (lowerCaseName.includes('address')) return faker.location.streetAddress();
    if (lowerCaseName.includes('zip') || lowerCaseName.includes('postal')) return faker.location.zipCode();
    if (lowerCaseName.includes('company')) return faker.company.name();
    return faker.lorem.words(3); // Default
}

// --- API ROUTE HANDLER ---
export async function POST(req: NextRequest) {
  try {
    const body: FormFillRequest = await req.json();
    const { pageState } = body;

    if (!pageState || !pageState.elements) {
      return NextResponse.json({ error: "Invalid page state provided" }, { status: 400 });
    }

    const operations: DOMOperation[] = [];
    const inputElements = pageState.elements.filter(
      el => (el.tagName === 'input' || el.tagName === 'textarea') && (el.name || el.placeholder)
    );
    
    for (const el of inputElements) {
        // Simple heuristic to avoid filling hidden or irrelevant fields
        if (el.tagName === 'input' && ['hidden', 'submit', 'button', 'checkbox', 'radio'].includes((el as any).type)) {
            continue;
        }

        const fieldIdentifier = el.name || el.placeholder;
        if (fieldIdentifier) {
            operations.push({
                type: 'type',
                name: fieldIdentifier,
                value: getDummyData(fieldIdentifier)
            });
        }
    }

    return NextResponse.json(operations);
  } catch (error) {
    console.error("Form-fill error:", error);
    return NextResponse.json({ error: "Failed to process form-filling request" }, { status: 500 });
  }
}