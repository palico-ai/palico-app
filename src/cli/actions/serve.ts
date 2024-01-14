import APIRequestHandler from "../../app/request_handler";
import CurrentProject from "../../utils/current_project";

export const ServeDevServer = async () => {
  const appConfig = await CurrentProject.getApplicationConfig();
  const app = new APIRequestHandler(appConfig);
  const api = app.getExpressApp();
  const port = 8001;
  api.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};
