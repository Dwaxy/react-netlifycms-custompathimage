import React from "react";
import CMS from "netlify-cms";
import "netlify-cms/dist/cms.css";

import { CustomPathImageControl, CustomPathImagePreview } from "./customPathImage.js";

CMS.registerWidget("custompathimage", CustomPathImageControl, CustomPathImagePreview);
