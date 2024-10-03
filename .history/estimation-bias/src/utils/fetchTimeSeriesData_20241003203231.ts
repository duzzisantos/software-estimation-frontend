interface TaskProperties {
  database_task?: number;
  security_task?: number;
  validation_task?: number;
  dev_ops_task?: number;
  server_management_task?: number;
  api_setup_task?: number;
  api_integration_task?: number;
  data_backup_task?: number;
  backend_testing_task?: number;
  data_structure_task?: number;
  machine_learning_task?: number;
  scalability_task?: number;
  optimization_task?: number;
  cloud_task?: number;
  styling_task?: number;
  ui_ux_task?: number;
  frontend_testing_task?: number;
  api_logic_task?: number;
  form_setup_task?: number;
  table_setup_task?: number;
  layout_setup_task?: number;
  data_display_task?: number;
  data_visualization_task?: number;
  access_control_task?: number;
  seo_task?: number;
  widget_setup_task?: number;
  ci_cd_task?: number;
  deployment_task?: number;
  cms_integration_task?: number;
  last_updated?: string;
  submitted_by?: string;
}

async function fetchPertData(postObject: TaskProperties) {
  try {
    const response = await fetch("http://localhost:8000/PertAnalysis", {
      method: "POST",
      body: JSON.stringify(postObject),
      headers: {
        "Content-Type": "application/json",
        Allow: "POST",
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

export default fetchPertData;
