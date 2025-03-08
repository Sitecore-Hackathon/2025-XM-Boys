![Hackathon Logo](docs/images/hackathon.png?raw=true "Hackathon Logo")

# Sitecore Hackathon 2025

-   MUST READ: **[Submission requirements](SUBMISSION_REQUIREMENTS.md)**
-   [Entry form template](ENTRYFORM.md)

## Team name

XM Boys


## Description

XM Boys aims to leverage generative AI to provide a cloud service akin to Pages, Explorer, and Components, as part of Composable DXP. This AI platform, named Jarvis, will retrieve information from a selected template, allowing users to edit content similarly to Explorer. Moreover, a helper button, the AI Assistant, will open a prompt where users can provide context for the text field they wish to generate for their module. Users can also offer module or company context to ensure accurate results from the AI tool.

The solution creates an item in Sitecore at the desired location. This initiative seeks to streamline content authoring and marketing efforts, providing an AI assistant for generative content, thereby saving time for users.

## Project Structure

Our solution consists of two main components:

- **XM Cloud Solution** - Based on the XM Cloud Starter Kit
- **Jarvis API** - An Express.js application that interfaces with Azure OpenAI and Sitecore GraphQL APIs

### Key Components

- **`with-editable-tools-wrapper.tsx`** - A Higher-Order Component (HOC) that integrates the cloning functionality into the Sitecore Pages interface. This component is critical as it:
  - Wraps Sitecore components to provide additional editing capabilities
  - Renders the clone button in the component toolbar
  - Handles the communication between the Sitecore Pages UI and the Jarvis API
  - Enables content authors to clone components directly from the editing interface

### Directory Structure

```
/
├── docs/                  # Documentation assets
├── src/
│   ├── jarvis-api/        # Jarvis API (Express.js application)
│   │   ├── src/
│   │   │   ├── models/    # Data models
│   │   │   ├── routes/    # API endpoints
│   │   │   ├── services/  # Business logic and external services
│   │   │   └── index.ts   # Main entry point
│   │   └── xmcloud/           # XM Cloud Starter Kit
│   │       ├── src/
│   │       │   ├── components/
│   │       │   │   └── withEditableToolsWrapper.tsx  # HOC that enables cloning in Pages
└── ENTRYFORM.md           # Hackathon submission details
```
## Video link
⟹ Provide a video highlighing your Hackathon module submission and provide a link to the video. You can use any video hosting, file share or even upload the video to this repository. _Just remember to update the link below_

⟹ [Replace this Video link](#video-link)

## Pre-requisites and Dependencies

### XM Cloud Solution

-   Install Docker Desktop and follow the pre-requisites for XM Cloud: [Walkthrough: Setting up your full-stack XM Cloud local development environment](https://doc.sitecore.com/xmc/en/developers/xm-cloud/walkthrough--setting-up-your-full-stack-xm-cloud-local-development-environment.html)

### Jarvis API (`/src/jarvis-api`)

-   Install Node JS `20.10.0`

## Installation Instructions

In order to use our module, it is necessary to install both components:

-   XM Cloud starter kit
-   Our Jarvis API

### Install XM Cloud Solution

This repository is based on the XM Cloud starter kit.

1. In an ADMIN terminal:

```ps1
.\init.ps1 -InitEnv -LicenseXmlPath "C:\path\to\license.xml" -AdminPassword "DesiredAdminPassword"
```

2. Restart your terminal and run:

```ps1
.\up.ps1
```

3. Push Items

```ps1
dotnet sitecore ser push
```

### Install Jarvis API

The API is created in the `/src/jarvis-api` folder. Since it is an ExpressJS app, first you need to install the dependencies:

```bash
cd src/jarvis-api
npm install
```

Also, this app uses a `.env.local` file to get some environment variables, so duplicate the `.env` file and rename it to `.env.local`. To set those variables, see the [configuration section](#configuration).

Build the solution:

```bash
npm run build
```

After that, you need to run the solution by executing this command:

```bash
npm run serve
```

This will initialize the API app at `http://localhost:3001`

### Configuration

#### Configure Jarvis API Environmental Variables

| Variable                      | Description                                                                                                                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                          | Port where the services will be running (default: 3001)                                                                                                                                        |
| GRAPH_QL_ENDPOINT             | Endpoint for the GraphQL API (e.g., "https://xmcloudcm.localhost/sitecore/api/authoring/graphql/v1")                                                                                           |
| GRAPH_QL_API_KEY              | [API key](https://doc.sitecore.com/xmc/en/developers/xm-cloud/walkthrough--enabling-and-authorizing-requests-to-the-authoring-and-management-api.html) for accessing the Authoring GraphQL API |

## API Endpoints

The Jarvis API provides the following endpoints, with cloning functionality being the core feature:

### `/api/clone`
- **Description**: Core functionality - facilitates cloning of templates and items in Sitecore Pages, which is not available by default in Sitecore
- **Method**: POST
- **Parameters**:
  - `sourceId` (required): ID of the source template or item to clone
  - `targetPath` (required): Path where the clone should be created
  - `newName` (required): Name for the cloned item
  - `fields` (optional): Fields to override in the cloned item
  - `includeChildren` (optional): Boolean flag to include child items in the clone operation (default: false)
  - `overwriteExisting` (optional): Boolean flag to overwrite existing items with the same name (default: false)
- **Response**:
  ```json
  {
    "id": "cloned-item-id",
    "name": "Cloned Item Name",
    "path": "/sitecore/content/path/to/cloned-item",
    "templateId": "template-id-of-cloned-item"
  }
  ```
- **Example Request**:
  ```json
  {
    "sourceId": "{GUID-OF-SOURCE-ITEM}",
    "targetPath": "/sitecore/content/destination-folder",
    "newName": "Cloned Homepage",
    "fields": {
      "Title": "New Homepage Title",
      "Description": "Updated description for the cloned page"
    },
    "includeChildren": true
  }
  ```


## Usage Instructions

### Developer Configuration

1. Create your SXA Component by following the steps for Cloning Rendering:

    - [More Info](https://developers.sitecore.com/learn/accelerate/xm-cloud/implementation/developer-experience/creating-new-components)
    - Go to Template Definition
    - Inherit the `_Searchable on Jarvis` template from `Feature/Jarvis` feature.

2. To enable cloning functionality for a component:
   
   - Import the HOC in your component file:
     ```tsx
     import { withEditableToolsWrapper } from 'path/to/withEditableToolsWrapper';
     ```
   
   - Wrap your component with the HOC:
     ```tsx
     const MyComponent = (props) => {
       // Your component implementation
     };
     
     // Export the wrapped component with cloning capabilities
     export default withEditableToolsWrapper(MyComponent);
     ```

### Marketer Use Case - Cloning Content

1. 

## Comments

It is important to ensure proper network connectivity between the Jarvis API and the XM Cloud Instance (Docker containers).

### Technical Architecture

#### HOC Integration with Sitecore Pages

The `with-editable-tools-wrapper.tsx` Higher-Order Component (HOC) is a crucial architectural element that enables the cloning functionality within Sitecore Pages. This component:

1. **Extends the Standard Editing Interface** - Adds custom buttons to the component toolbars in Sitecore Pages
2. **Intercepts Editing Actions** - Captures user interactions and routes them to the appropriate handlers
3. **Communicates with Jarvis API** - Makes requests to the cloning endpoints when users trigger clone operations
4. **Renders Custom UI Elements** - Displays clone confirmation dialogs and success/error messages

This architectural approach allows the cloning functionality to be seamlessly integrated into the Sitecore Pages experience without modifying the core Sitecore codebase.

### Cloning Service Implementation

The core cloning functionality is implemented through the following components:

#### `clone.ts` Route

The `src/jarvis-api/src/routes/clone.ts` file defines the API endpoint that handles cloning requests:

```typescript
import { Router, Request, Response } from "express";
import { cloneRendering } from "../services/item";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    let body = req.body;
    const response = await cloneRendering(body);
    res.json({ success: true, response });
});

export default router;
```

This route:
- Exposes a POST endpoint at `/api/clone`
- Accepts request body parameters for the cloning operation
- Calls the `cloneRendering` service function with these parameters
- Returns a JSON response with the cloning operation result

#### `cloneRendering` Service

The `cloneRendering` function in `src/jarvis-api/src/services/item.ts` is the core implementation of the cloning logic:

```typescript
export const cloneRendering = async (body: CloneRenderingBody) => {
    // Retrieve the final rendering XML from Sitecore
    const finalRendering = await getFinalRendering(body.itemId, body.language);
    
    // Parse the XML representation of the rendering
    const parseXml = promisify(parseString);
    const result = (await parseXml(finalRendering)) as any;
    let renderings = result.r.d[0].r;

    // Clone the rendering and its datasource
    const cloneResponse = await cloneRenderingInLayout(
        renderings,
        body.renderingId,
        body.dataSource
    );
    
    // Process any nested placeholders
    renderings = await processPlaceholders(
        renderings,
        body.placeholders ?? {},
        cloneResponse.clone.$["s:ph"],
        cloneResponse.nextDynamicPlaceholderId
    );

    // Convert back to XML and update the item
    // ...
}
```

Key features of this implementation:
1. **XML Processing** - The function works with Sitecore's XML representation of renderings
2. **Deep Cloning** - Clones not just the component but also its datasource
3. **Placeholder Management** - Handles dynamic placeholders and nested components
4. **Unique ID Generation** - Creates new UIDs for cloned items to ensure uniqueness

#### Cloning Process Flow

The cloning process follows these steps:
1. Client calls the `/api/clone` endpoint with the source component details
2. The API retrieves the current rendering XML from Sitecore
3. The system identifies the target component and its datasource
4. A duplicate datasource item is created (if applicable)
5. A clone of the component is created with updated parameters and references
6. Any nested components or placeholders are recursively processed
7. The updated rendering XML is converted back and saved to Sitecore
8. The new component's ID and information are returned to the client

This implementation enables seamless component cloning in Sitecore Pages, a feature not available in the standard product.

### Implementation Example

Components that need cloning capability can be wrapped with the HOC:

```tsx
import { withEditableToolsWrapper } from '../../components/withEditableToolsWrapper';
import { MyComponent } from './MyComponent';

// Apply the HOC to enable cloning functionality
export const MyComponentWithCloning = withEditableToolsWrapper(MyComponent);
```
