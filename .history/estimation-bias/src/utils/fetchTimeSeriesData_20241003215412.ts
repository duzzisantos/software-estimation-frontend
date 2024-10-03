interface TaskProperties {
  database_task?: number | undefined;
  security_task?: number | undefined;
  validation_task?: number | undefined;
  dev_ops_task?: number | undefined;
  server_management_task?: number | undefined;
  api_setup_task?: number | undefined;
  api_integration_task?: number | undefined;
  data_backup_task?: number | undefined;
  backend_testing_task?: number | undefined;
  data_structure_task?: number | undefined;
  machine_learning_task?: number | undefined;
  scalability_task?: number | undefined;
  optimization_task?: number | undefined;
  cloud_task?: number | undefined;
  styling_task?: number | undefined;
  ui_ux_task?: number | undefined;
  frontend_testing_task?: number | undefined;
  api_logic_task?: number | undefined;
  form_setup_task?: number | undefined;
  table_setup_task?: number | undefined;
  layout_setup_task?: number | undefined;
  data_display_task?: number | undefined;
  data_visualization_task?: number | undefined;
  access_control_task?: number | undefined;
  seo_task?: number | undefined;
  widget_setup_task?: number | undefined;
  ci_cd_task?: number | undefined;
  deployment_task?: number | undefined;
  cms_integration_task?: number | undefined;
  last_updated?: string | undefined;
  submitted_by?: string | undefined;
}

async function createWorkLogs(postObject: TaskProperties) {
  try {
    const response = await fetch("http://localhost:4000/CreateWorkLog", {
      method: "POST",
      body: JSON.stringify(postObject),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:4000/",
      },
    });

    if (!response.ok || response.status !== 200) {
      throw new Error(`${response.status}, Cause: ${response.type}`);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error: unknown) {
    console.error(error);
  }
}

export default createWorkLogs;
