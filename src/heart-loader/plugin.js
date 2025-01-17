const storage = require('./deps-storage')

class HeartPlugin {
  apply(compiler) {
    const pluginName = HeartPlugin.name;
    const { webpack } = compiler;
    const { Compilation } = webpack;
    const { RawSource } = webpack.sources;
    // to the compilation process on an earlier stage.
    compiler.hooks.thisCompilation.tap(pluginName, (compilation, compilationParams) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          additionalAssets: false,
        },
        (assets) => {
          for (let i in assets) {
            if (i.startsWith('main.')) {
              const asset = compilation.getAsset(i);
              const contents = asset.source.source();
              const updatedSrc = contents.replace(
                '/*IMPORTS-TREE-PLACEHOLDER*/',
                JSON.stringify(storage.getAll()).replaceAll("\"", "'").slice(1, -1) // double quatoers is used by source maps
                // slice removes { and }
              )
              compilation.updateAsset(i, new RawSource(updatedSrc));
            }
          }
        }
      );
    });
  }
}

module.exports = { HeartPlugin };