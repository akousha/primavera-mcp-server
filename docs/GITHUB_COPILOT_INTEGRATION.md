# GitHub Copilot Chat Integration

This guide explains how to integrate the Primavera Data Service MCP Server with GitHub Copilot Chat to access Oracle Primavera P6 database tools directly within your GitHub workflow.

## 🚀 Quick Setup

### Step 1: Install the Extension

1. Copy the `copilot-extensions.json` file to your GitHub Copilot Chat extensions directory:

   ```bash
   npm run copilot:install
   ```

2. Restart GitHub Copilot Chat or reload your IDE

### Step 2: Verify Connection

Test that the server is accessible:

```bash
npm run copilot:validate
```

### Step 3: Test Integration

Try using the extension in GitHub Copilot Chat:

```bash
npm run copilot:test
```

## 🛠️ Available Tools in GitHub Copilot Chat

Once integrated, you can use these Primavera tools directly in GitHub Copilot Chat:

### 1. **@primavera-data-service sync-metadata**

Synchronizes database metadata for all Primavera tables and views.

```text
Example usage in chat:
"@primavera-data-service sync-metadata to update all table structures"
```

### 2. **@primavera-data-service get-tables-metadata**

Retrieves metadata information about available tables and views.

```text
Example usage:
"@primavera-data-service get-tables-metadata to see available project tables"
```

### 3. **@primavera-data-service get-columns-metadata-of-table**

Get detailed column information for a specific table.

```text
Example usage:
"@primavera-data-service get-columns-metadata-of-table for PROJECT table"
```

### 4. **@primavera-data-service query-tables-data**

Execute SQL queries against Primavera database tables.

```text
Example usage:
"@primavera-data-service query-tables-data to get all active projects: SELECT proj_id, proj_name FROM PROJECT WHERE proj_status = 'Active'"
```

### 5. **@primavera-data-service view-job-status**

Monitor the status of background jobs and operations.

```text
Example usage:
"@primavera-data-service view-job-status to check running import jobs"
```

### 6. **@primavera-data-service view-metadata-seed-status-of-configuration**

Check the progress of metadata seeding operations.

```text
Example usage:
"@primavera-data-service view-metadata-seed-status-of-configuration for current setup"
```

### 7. **@primavera-data-service download-zip-data**

Download project data exports in ZIP format.

```text
Example usage:
"@primavera-data-service download-zip-data for project backup with filters"
```

## 💬 Chat Commands Examples

### Project Analysis

```text
You: "Show me all active projects with their completion percentage"
Copilot: I'll query the Primavera database for you.
@primavera-data-service query-tables-data 
SELECT proj_id, proj_name, phys_complete_pct 
FROM PROJECT 
WHERE proj_status = 'Active' 
ORDER BY phys_complete_pct DESC;
```

### Resource Management

```text
You: "Get information about resource allocations for this month"
Copilot: Let me check the resource data in Primavera.
@primavera-data-service query-tables-data
SELECT r.rsrc_name, ra.alloc_qty, p.proj_name
FROM RESOURCE r
JOIN RSRC_ASSIGN ra ON r.rsrc_id = ra.rsrc_id  
JOIN PROJECT p ON ra.proj_id = p.proj_id
WHERE ra.alloc_start_date >= TRUNC(SYSDATE, 'MONTH');
```

### Schedule Analysis

```text
You: "Find all critical path activities that are behind schedule"
Copilot: I'll analyze the critical activities for you.
@primavera-data-service query-tables-data
SELECT a.activity_id, a.activity_name, a.target_drtn_hr_cnt, 
       a.remain_drtn_hr_cnt, p.proj_name
FROM ACTIVITY a
JOIN PROJECT p ON a.proj_id = p.proj_id
WHERE a.crit_drv_path_flag = 'Y' 
  AND a.remain_drtn_hr_cnt > a.target_drtn_hr_cnt;
```

## 🔧 Configuration Details

### Server Information

- **Production URL**: `https://primavera-mcp-server-production.up.railway.app`
- **Health Endpoint**: `/health`
- **MCP Endpoint**: `/mcp`
- **Transport**: HTTP/HTTPS
- **Authentication**: Server-side environment variables (no client auth required)

### Supported Data Types

- Project data (PROJECT table)
- Activity schedules (ACTIVITY table)  
- Resource assignments (RSRC_ASSIGN table)
- Work Breakdown Structure (WBS table)
- Baseline comparisons (BASELINE_PROJECT table)
- Custom fields and UDFs
- Calendar and holiday data

## 🚨 Usage Guidelines

### Best Practices

1. **Start with metadata sync**: Always run `sync-metadata` before complex queries
2. **Use specific table names**: Reference exact Primavera table names (e.g., PROJECT, ACTIVITY)
3. **Limit large queries**: Add `ROWNUM <= 100` for exploratory queries
4. **Check job status**: Monitor long-running operations with `view-job-status`

### Security Notes

- All database credentials are securely stored server-side
- No sensitive information is transmitted through GitHub Copilot Chat
- Queries are executed with read-only permissions
- Server logs all API access for audit purposes

### Troubleshooting

**Extension not appearing in chat:**

```bash
# Verify server health
npm run copilot:validate

# Check extension configuration
cat copilot-extensions.json
```

**Query errors:**

```text
1. Run sync-metadata first to update table structures
2. Verify table names with get-tables-metadata
3. Check column names with get-columns-metadata-of-table
```

**Connection timeouts:**

```text
- Server may be in sleep mode (Railway auto-scaling)
- Try the health endpoint first to wake up the server
- Wait 30 seconds and retry
```

## 📊 Example Workflows

### Weekly Project Report

```text
1. "@primavera-data-service sync-metadata"
2. "@primavera-data-service query-tables-data for weekly progress report"
3. "@primavera-data-service download-zip-data for project documentation"
```

### Resource Planning

```text
1. "@primavera-data-service get-tables-metadata to see resource tables"
2. "@primavera-data-service query-tables-data for resource availability analysis"
3. "@primavera-data-service view-job-status to monitor import processes"
```

### Schedule Optimization

```text
1. "@primavera-data-service query-tables-data for critical path analysis"
2. "@primavera-data-service get-columns-metadata-of-table for ACTIVITY constraints"
3. "@primavera-data-service query-tables-data for schedule variance report"
```

---

## 🔗 Additional Resources

- **Server Repository**: <https://github.com/akousha/primavera-mcp-server>
- **Production Server**: <https://primavera-mcp-server-production.up.railway.app>
- **MCP Protocol**: <https://modelcontextprotocol.io>
- **Oracle Primavera P6**: <https://www.oracle.com/construction-engineering/primavera-p6>

For support or feature requests, please open an issue in the GitHub repository.
