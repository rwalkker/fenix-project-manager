"use strict";
// FENIX Project Manager - Macro Builder Service
// VBA macro generation for Excel automation
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.MacroBuilderService = void 0;
/**
 * Macro Builder Service
 * Generates VBA macros for Excel automation
 */
class MacroBuilderService {
    templates;
    constructor() {
        this.templates = new Map();
        this.initializeTemplates();
    }
    /**
     * Initialize macro templates
     */
    initializeTemplates() {
        // Auto-format data
        this.templates.set('auto-format', {
            id: 'auto-format',
            name: 'Auto Format Data',
            description: 'Automatically format data with headers, borders, and alternating row colors',
            category: 'formatting',
            generate: (params) => ({
                name: 'AutoFormatData',
                description: 'Formats selected range with professional styling',
                code: `Sub AutoFormatData()
    Dim rng As Range
    Set rng = Selection
    
    ' Apply header formatting
    With rng.Rows(1)
        .Font.Bold = True
        .Font.Size = 12
        .Interior.Color = RGB(${params.headerColor || '68, 114, 196'})
        .Font.Color = RGB(255, 255, 255)
        .HorizontalAlignment = xlCenter
    End With
    
    ' Apply borders
    With rng.Borders
        .LineStyle = xlContinuous
        .Weight = xlThin
        .Color = RGB(200, 200, 200)
    End With
    
    ' Apply alternating row colors
    Dim i As Long
    For i = 2 To rng.Rows.Count
        If i Mod 2 = 0 Then
            rng.Rows(i).Interior.Color = RGB(242, 242, 242)
        End If
    Next i
    
    ' Auto-fit columns
    rng.Columns.AutoFit
    
    MsgBox "Data formatted successfully!", vbInformation
End Sub`,
                category: 'formatting',
                usage: 'Select the data range including headers, then run the macro',
                example: 'Select A1:E100 and run AutoFormatData'
            })
        });
        // Remove duplicates
        this.templates.set('remove-duplicates', {
            id: 'remove-duplicates',
            name: 'Remove Duplicate Rows',
            description: 'Removes duplicate rows based on specified columns',
            category: 'data-processing',
            generate: (params) => ({
                name: 'RemoveDuplicates',
                description: 'Removes duplicate rows from selected data',
                code: `Sub RemoveDuplicates()
    Dim rng As Range
    Dim lastRow As Long
    Dim ws As Worksheet
    
    Set ws = ActiveSheet
    Set rng = Selection
    
    If rng.Rows.Count < 2 Then
        MsgBox "Please select a range with at least 2 rows", vbExclamation
        Exit Sub
    End If
    
    ' Store original count
    Dim originalCount As Long
    originalCount = rng.Rows.Count - 1 ' Exclude header
    
    ' Remove duplicates (considering all columns)
    rng.RemoveDuplicates Columns:=Array(${params.columns || '1, 2, 3'}), Header:=xlYes
    
    ' Calculate removed count
    Dim newCount As Long
    newCount = rng.Rows.Count - 1
    Dim removedCount As Long
    removedCount = originalCount - newCount
    
    MsgBox "Removed " & removedCount & " duplicate row(s). " & newCount & " unique row(s) remaining.", vbInformation
End Sub`,
                category: 'data-processing',
                parameters: [{
                        name: 'columns',
                        type: 'string',
                        description: 'Column numbers to check for duplicates (e.g., "1, 2, 3")',
                        required: false
                    }],
                usage: 'Select the data range including headers, then run the macro',
                example: 'Select A1:D100 and run RemoveDuplicates'
            })
        });
        // Sort data
        this.templates.set('sort-data', {
            id: 'sort-data',
            name: 'Sort Data',
            description: 'Sorts data by specified column',
            category: 'data-processing',
            generate: (params) => ({
                name: 'SortData',
                description: 'Sorts selected data by specified column',
                code: `Sub SortData()
    Dim rng As Range
    Dim sortColumn As Long
    Dim sortOrder As XlSortOrder
    
    Set rng = Selection
    
    If rng.Rows.Count < 2 Then
        MsgBox "Please select a range with at least 2 rows", vbExclamation
        Exit Sub
    End If
    
    ' Prompt for sort column
    sortColumn = ${params.sortColumn || 1}
    sortOrder = ${params.ascending ? 'xlAscending' : 'xlDescending'}
    
    ' Sort the data
    With ActiveSheet.Sort
        .SortFields.Clear
        .SortFields.Add Key:=rng.Columns(sortColumn), _
            SortOn:=xlSortOnValues, _
            Order:=sortOrder, _
            DataOption:=xlSortNormal
        .SetRange rng
        .Header = xlYes
        .MatchCase = False
        .Orientation = xlTopToBottom
        .Apply
    End With
    
    MsgBox "Data sorted successfully!", vbInformation
End Sub`,
                category: 'data-processing',
                parameters: [
                    {
                        name: 'sortColumn',
                        type: 'number',
                        description: 'Column number to sort by (1-based)',
                        required: true
                    },
                    {
                        name: 'ascending',
                        type: 'boolean',
                        description: 'Sort in ascending order',
                        required: false
                    }
                ],
                usage: 'Select the data range including headers, then run the macro',
                example: 'Select A1:E100 and run SortData'
            })
        });
        // Filter data
        this.templates.set('filter-data', {
            id: 'filter-data',
            name: 'Apply Auto Filter',
            description: 'Applies auto filter to data range',
            category: 'data-processing',
            generate: () => ({
                name: 'ApplyAutoFilter',
                description: 'Applies auto filter to selected data',
                code: `Sub ApplyAutoFilter()
    Dim rng As Range
    Set rng = Selection
    
    ' Remove existing filters
    If ActiveSheet.AutoFilterMode Then
        ActiveSheet.AutoFilterMode = False
    End If
    
    ' Apply auto filter
    rng.AutoFilter
    
    MsgBox "Auto filter applied successfully!", vbInformation
End Sub`,
                category: 'data-processing',
                usage: 'Select the data range including headers, then run the macro',
                example: 'Select A1:E100 and run ApplyAutoFilter'
            })
        });
        // Create pivot table
        this.templates.set('create-pivot', {
            id: 'create-pivot',
            name: 'Create Pivot Table',
            description: 'Creates a pivot table from selected data',
            category: 'analysis',
            generate: (params) => ({
                name: 'CreatePivotTable',
                description: 'Creates a pivot table from selected data',
                code: `Sub CreatePivotTable()
    Dim sourceData As Range
    Dim pivotSheet As Worksheet
    Dim pivotCache As PivotCache
    Dim pivotTable As PivotTable
    Dim pivotLocation As Range
    
    ' Set source data
    Set sourceData = Selection
    
    If sourceData.Rows.Count < 2 Then
        MsgBox "Please select a range with at least 2 rows (including header)", vbExclamation
        Exit Sub
    End If
    
    ' Create new sheet for pivot table
    Set pivotSheet = Worksheets.Add
    pivotSheet.Name = "PivotTable_" & Format(Now, "hhmmss")
    
    ' Set pivot table location
    Set pivotLocation = pivotSheet.Range("A1")
    
    ' Create pivot cache
    Set pivotCache = ActiveWorkbook.PivotCaches.Create( _
        SourceType:=xlDatabase, _
        SourceData:=sourceData)
    
    ' Create pivot table
    Set pivotTable = pivotCache.CreatePivotTable( _
        TableDestination:=pivotLocation, _
        TableName:="PivotTable_" & Format(Now, "hhmmss"))
    
    ' Configure pivot table (customize as needed)
    With pivotTable
        ' Add row field (first column)
        .PivotFields(sourceData.Cells(1, 1).Value).Orientation = xlRowField
        
        ' Add data field (last column)
        Dim lastCol As Long
        lastCol = sourceData.Columns.Count
        .AddDataField .PivotFields(sourceData.Cells(1, lastCol).Value), _
            "Sum of " & sourceData.Cells(1, lastCol).Value, xlSum
    End With
    
    MsgBox "Pivot table created successfully!", vbInformation
End Sub`,
                category: 'analysis',
                usage: 'Select the source data range including headers, then run the macro',
                example: 'Select A1:E100 and run CreatePivotTable'
            })
        });
        // Export to CSV
        this.templates.set('export-csv', {
            id: 'export-csv',
            name: 'Export to CSV',
            description: 'Exports selected data to CSV file',
            category: 'utility',
            generate: () => ({
                name: 'ExportToCSV',
                description: 'Exports selected data to CSV file',
                code: `Sub ExportToCSV()
    Dim rng As Range
    Dim filePath As String
    Dim fileName As String
    
    Set rng = Selection
    
    ' Prompt for file name
    fileName = InputBox("Enter file name (without extension):", "Export to CSV", "export_" & Format(Now, "yyyymmdd_hhmmss"))
    
    If fileName = "" Then Exit Sub
    
    ' Set file path
    filePath = ThisWorkbook.Path & "\\" & fileName & ".csv"
    
    ' Copy selection to new workbook
    Dim newWb As Workbook
    Set newWb = Workbooks.Add
    
    rng.Copy
    newWb.Sheets(1).Range("A1").PasteSpecial xlPasteValues
    Application.CutCopyMode = False
    
    ' Save as CSV
    newWb.SaveAs Filename:=filePath, FileFormat:=xlCSV
    newWb.Close SaveChanges:=False
    
    MsgBox "Data exported to: " & filePath, vbInformation
End Sub`,
                category: 'utility',
                usage: 'Select the data range to export, then run the macro',
                example: 'Select A1:E100 and run ExportToCSV'
            })
        });
        // Highlight duplicates
        this.templates.set('highlight-duplicates', {
            id: 'highlight-duplicates',
            name: 'Highlight Duplicates',
            description: 'Highlights duplicate values in selected column',
            category: 'formatting',
            generate: () => ({
                name: 'HighlightDuplicates',
                description: 'Highlights duplicate values in selected range',
                code: `Sub HighlightDuplicates()
    Dim rng As Range
    Dim cell As Range
    Dim dict As Object
    Dim duplicateCount As Long
    
    Set rng = Selection
    Set dict = CreateObject("Scripting.Dictionary")
    duplicateCount = 0
    
    ' First pass: count occurrences
    For Each cell In rng
        If cell.Value <> "" Then
            If dict.Exists(cell.Value) Then
                dict(cell.Value) = dict(cell.Value) + 1
            Else
                dict.Add cell.Value, 1
            End If
        End If
    Next cell
    
    ' Second pass: highlight duplicates
    For Each cell In rng
        If cell.Value <> "" Then
            If dict(cell.Value) > 1 Then
                cell.Interior.Color = RGB(255, 199, 206) ' Light red
                cell.Font.Color = RGB(156, 0, 6) ' Dark red
                duplicateCount = duplicateCount + 1
            End If
        End If
    Next cell
    
    MsgBox "Highlighted " & duplicateCount & " duplicate cell(s).", vbInformation
End Sub`,
                category: 'formatting',
                usage: 'Select the range to check for duplicates, then run the macro',
                example: 'Select A2:A100 and run HighlightDuplicates'
            })
        });
        // Clear formatting
        this.templates.set('clear-formatting', {
            id: 'clear-formatting',
            name: 'Clear Formatting',
            description: 'Removes all formatting from selected cells',
            category: 'formatting',
            generate: () => ({
                name: 'ClearFormatting',
                description: 'Removes all formatting from selected cells',
                code: `Sub ClearFormatting()
    Dim rng As Range
    Set rng = Selection
    
    ' Clear formats
    rng.ClearFormats
    
    ' Reset to default font
    With rng.Font
        .Name = "Calibri"
        .Size = 11
        .Bold = False
        .Italic = False
        .Color = RGB(0, 0, 0)
    End With
    
    MsgBox "Formatting cleared successfully!", vbInformation
End Sub`,
                category: 'formatting',
                usage: 'Select the range to clear formatting, then run the macro',
                example: 'Select A1:E100 and run ClearFormatting'
            })
        });
        // Data validation
        this.templates.set('add-validation', {
            id: 'add-validation',
            name: 'Add Data Validation',
            description: 'Adds data validation to selected cells',
            category: 'data-processing',
            generate: (params) => ({
                name: 'AddDataValidation',
                description: 'Adds data validation to selected cells',
                code: `Sub AddDataValidation()
    Dim rng As Range
    Set rng = Selection
    
    ' Clear existing validation
    rng.Validation.Delete
    
    ' Add validation (${params.validationType || 'list'})
    ${this.generateValidationCode(params)}
    
    MsgBox "Data validation added successfully!", vbInformation
End Sub`,
                category: 'data-processing',
                parameters: [
                    {
                        name: 'validationType',
                        type: 'string',
                        description: 'Type of validation: list, number, date, text',
                        required: true
                    },
                    {
                        name: 'criteria',
                        type: 'string',
                        description: 'Validation criteria',
                        required: true
                    }
                ],
                usage: 'Select the cells to add validation, then run the macro',
                example: 'Select B2:B100 and run AddDataValidation'
            })
        });
        // Conditional formatting
        this.templates.set('conditional-format', {
            id: 'conditional-format',
            name: 'Apply Conditional Formatting',
            description: 'Applies conditional formatting based on cell values',
            category: 'formatting',
            generate: (params) => ({
                name: 'ApplyConditionalFormatting',
                description: 'Applies conditional formatting to selected range',
                code: `Sub ApplyConditionalFormatting()
    Dim rng As Range
    Set rng = Selection
    
    ' Clear existing conditional formatting
    rng.FormatConditions.Delete
    
    ' Add conditional formatting for values > ${params.threshold || 100}
    With rng.FormatConditions.Add(Type:=xlCellValue, Operator:=xlGreater, Formula1:="${params.threshold || 100}")
        .Interior.Color = RGB(${params.highColor || '146, 208, 80'}) ' Green
        .Font.Color = RGB(0, 0, 0)
    End With
    
    ' Add conditional formatting for values < ${params.lowThreshold || 50}
    With rng.FormatConditions.Add(Type:=xlCellValue, Operator:=xlLess, Formula1:="${params.lowThreshold || 50}")
        .Interior.Color = RGB(${params.lowColor || '255, 199, 206'}) ' Red
        .Font.Color = RGB(156, 0, 6)
    End With
    
    MsgBox "Conditional formatting applied successfully!", vbInformation
End Sub`,
                category: 'formatting',
                parameters: [
                    {
                        name: 'threshold',
                        type: 'number',
                        description: 'High value threshold',
                        required: false
                    },
                    {
                        name: 'lowThreshold',
                        type: 'number',
                        description: 'Low value threshold',
                        required: false
                    }
                ],
                usage: 'Select the range to apply conditional formatting, then run the macro',
                example: 'Select C2:C100 and run ApplyConditionalFormatting'
            })
        });
    }
    /**
     * Generate validation code based on type
     */
    generateValidationCode(params) {
        const type = params.validationType || 'list';
        switch (type) {
            case 'list':
                return `With rng.Validation
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, _
            Formula1:="${params.criteria || 'Yes,No,Maybe'}"
        .IgnoreBlank = True
        .InCellDropdown = True
    End With`;
            case 'number':
                return `With rng.Validation
        .Add Type:=xlValidateWholeNumber, AlertStyle:=xlValidAlertStop, _
            Operator:=xlBetween, Formula1:="${params.min || 0}", Formula2:="${params.max || 100}"
        .IgnoreBlank = True
        .InputMessage = "Enter a number between ${params.min || 0} and ${params.max || 100}"
    End With`;
            case 'date':
                return `With rng.Validation
        .Add Type:=xlValidateDate, AlertStyle:=xlValidAlertStop, _
            Operator:=xlBetween, Formula1:="${params.startDate || '1/1/2024'}", Formula2:="${params.endDate || '12/31/2024'}"
        .IgnoreBlank = True
        .InputMessage = "Enter a date between ${params.startDate || '1/1/2024'} and ${params.endDate || '12/31/2024'}"
    End With`;
            case 'text':
                return `With rng.Validation
        .Add Type:=xlValidateTextLength, AlertStyle:=xlValidAlertStop, _
            Operator:=xlBetween, Formula1:="${params.minLength || 1}", Formula2:="${params.maxLength || 255}"
        .IgnoreBlank = True
        .InputMessage = "Enter text between ${params.minLength || 1} and ${params.maxLength || 255} characters"
    End With`;
            default:
                return `' Custom validation code here`;
        }
    }
    /**
     * Get all available macro templates
     */
    getTemplates() {
        return Array.from(this.templates.values());
    }
    /**
     * Get template by ID
     */
    getTemplate(id) {
        return this.templates.get(id);
    }
    /**
     * Generate macro from template
     */
    generateMacro(templateId, params = {}) {
        const template = this.templates.get(templateId);
        if (!template) {
            return null;
        }
        return template.generate(params);
    }
    /**
     * Generate custom macro from natural language description
     */
    generateCustomMacro(description) {
        const lower = description.toLowerCase();
        // Try to match with existing templates
        if (lower.includes('format') && lower.includes('data')) {
            return this.generateMacro('auto-format');
        }
        if (lower.includes('duplicate')) {
            if (lower.includes('remove')) {
                return this.generateMacro('remove-duplicates');
            }
            else if (lower.includes('highlight')) {
                return this.generateMacro('highlight-duplicates');
            }
        }
        if (lower.includes('sort')) {
            return this.generateMacro('sort-data');
        }
        if (lower.includes('filter')) {
            return this.generateMacro('filter-data');
        }
        if (lower.includes('pivot')) {
            return this.generateMacro('create-pivot');
        }
        if (lower.includes('export') && lower.includes('csv')) {
            return this.generateMacro('export-csv');
        }
        if (lower.includes('validation')) {
            return this.generateMacro('add-validation');
        }
        if (lower.includes('conditional') && lower.includes('format')) {
            return this.generateMacro('conditional-format');
        }
        // Generate basic macro template
        return {
            name: 'CustomMacro',
            description: 'Custom macro based on: ' + description,
            code: `Sub CustomMacro()
    ' ${description}
    Dim rng As Range
    Set rng = Selection
    
    ' Add your custom code here
    
    MsgBox "Macro executed successfully!", vbInformation
End Sub`,
            category: 'utility',
            usage: 'Customize the macro code as needed',
            example: 'Edit the macro and run it'
        };
    }
    /**
     * Get macro categories
     */
    getCategories() {
        const categories = new Set();
        this.templates.forEach(template => {
            categories.add(template.category);
        });
        return Array.from(categories);
    }
    /**
     * Get templates by category
     */
    getTemplatesByCategory(category) {
        return Array.from(this.templates.values()).filter(template => template.category === category);
    }
    /**
     * Validate macro code
     */
    validateMacroCode(code) {
        const errors = [];
        const warnings = [];
        // Check for Sub/Function declaration
        if (!code.match(/Sub\s+\w+\s*\(/i) && !code.match(/Function\s+\w+\s*\(/i)) {
            errors.push('Macro must start with Sub or Function declaration');
        }
        // Check for End Sub/Function
        if (!code.match(/End\s+Sub/i) && !code.match(/End\s+Function/i)) {
            errors.push('Macro must end with End Sub or End Function');
        }
        // Check for common issues
        if (code.includes('On Error Resume Next')) {
            warnings.push('Using "On Error Resume Next" can hide errors - use with caution');
        }
        if (code.includes('Application.ScreenUpdating = False') &&
            !code.includes('Application.ScreenUpdating = True')) {
            warnings.push('Screen updating is disabled but not re-enabled');
        }
        if (code.includes('Application.Calculation = xlCalculationManual') &&
            !code.includes('Application.Calculation = xlCalculationAutomatic')) {
            warnings.push('Calculation is set to manual but not restored to automatic');
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
}
exports.MacroBuilderService = MacroBuilderService;
//# sourceMappingURL=MacroBuilderService.js.map