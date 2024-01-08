class Config {
  public readonly ProjectConfigFileName = "palico.json";
  public readonly BuildDirectory = "build";
  public readonly BundleFileKey = "bundle.zip";
  public readonly ClientAPIURL = "https://j5jbhlltp7.execute-api.us-east-1.amazonaws.com/prod";
}

const config = new Config();

export default config;
