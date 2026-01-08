"use strict";
/**
 * Core document type definitions for FENIX Project Manager
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateCategory = exports.DocumentFormat = exports.DocumentType = void 0;
var DocumentType;
(function (DocumentType) {
    DocumentType["POWERPOINT"] = "powerpoint";
    DocumentType["EXCEL"] = "excel";
    DocumentType["WORD"] = "word";
    DocumentType["MULTI_FORMAT"] = "multi-format";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentFormat;
(function (DocumentFormat) {
    DocumentFormat["PPTX"] = "pptx";
    DocumentFormat["XLSX"] = "xlsx";
    DocumentFormat["DOCX"] = "docx";
    DocumentFormat["PDF"] = "pdf";
})(DocumentFormat || (exports.DocumentFormat = DocumentFormat = {}));
var TemplateCategory;
(function (TemplateCategory) {
    TemplateCategory["PRESENTATION"] = "presentation";
    TemplateCategory["REPORT"] = "report";
    TemplateCategory["WHITEPAPER"] = "whitepaper";
    TemplateCategory["CHANGE_MANAGEMENT"] = "change-management";
    TemplateCategory["PROJECT_CHARTER"] = "project-charter";
    TemplateCategory["STATUS_REPORT"] = "status-report";
    TemplateCategory["DATA_ANALYSIS"] = "data-analysis";
    TemplateCategory["MEETING_MINUTES"] = "meeting-minutes";
    TemplateCategory["SOP"] = "sop";
    TemplateCategory["CUSTOM"] = "custom";
})(TemplateCategory || (exports.TemplateCategory = TemplateCategory = {}));
//# sourceMappingURL=document-types.js.map