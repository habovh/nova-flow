
var langserver = null;

exports.activate = function() {
    // Do work when the extension is activated
    langserver = new FlowLanguageServer();
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
    if (langserver) {
        langserver.deactivate();
        langserver = null;
    }
}

const reload = function() {
    langserver.restart()
};

nova.commands.register("io.becker.Flow.reload", reload);
nova.commands.register(
    "io.becker.Flow.openWorkspaceConfig",
    () => {
        nova.workspace.openConfig("io.becker.Flow")
    }
);

class FlowLanguageServer {
    constructor() {
        // Observe the configuration setting for the server's location, and restart the server on change
        nova.config.observe('io.becker.Flow.language-server-path', function(path) {
            this.start(path);
        }, this);
    }
    
    deactivate() {
        this.stop();
    }
    
    restart() {
        const path = nova.config.get('io.becker.Flow.language-server-path', 'string')
        this.start(path)
    }
    
    start(path) {
        if (this.languageClient) {
            console.log('reloading...')
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
        } else {
            console.log('activating...')
        }
        
        // Use the default server path
        if (!path) {
            path = nova.path.join(nova.workspace.path, 'node_modules/.bin/flow');

        }
        
        // Create the client
        var serverOptions = {
            path: path,
            args: ['lsp', '--from', 'Nova'],
        };
        var clientOptions = {
            // The set of document syntaxes for which the server is valid
            syntaxes: ['javascript']
        };
        var client = new LanguageClient('io.becker.Flow', 'Flow Language Server', serverOptions, clientOptions);
        
        try {
            // Start the client
            client.start();
            
            // Add the client to the subscriptions to be cleaned up
            nova.subscriptions.add(client);
            this.languageClient = client;
            console.log('activated')
        }
        catch (err) {
            // If the .start() method throws, it's likely because the path to the language server is invalid
            
            if (nova.inDevMode()) {
                console.error(err);
            }
        }
    }
    
    stop() {
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
            this.languageClient = null;
        }
    }
}

