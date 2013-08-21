Router.map(function() {

    //  /diagram/ID
    // Loads a diagram with the assets.
    this.route('diagram', {
        path: '/diagram/:id',
        onBeforeRun: function() {
            console.log('onBeforeRerun#new_diagram');
            Session.set('diagramId', this.params.id);
        }
        // TODO: I think diagram validation might be good here
        //loading: 'loadingTemplate',
        //notFound: 'notFoundTemplate'
    });

    // TODO: Provide an actual landing page with instructions.
    // TODO: Could this step just be skipped over like JSFiddle.  Would save time!
    this.route('home', {path: '/'});

    // TODO: Provide actual help
    this.route('home', {path: '/help'});

    this.route('new_diagram', {
        path: '/new_diagram',
        onBeforeRerun: createDiagram,
        onBeforeRun: createDiagram
    });
    this.route('not_found', {path: '*'});
});

function createDiagram() {
    console.log('onBeforeRerun#new_diagram');
    Meteor.call('createDiagram', function(err, id) {
        window.location = '/diagram/' + id;
    });
}

/*
Meteor.Router.filters({
    validateDiagram: function(page) {
        // TODO: Will require a refactor
        return page;
    },
    /**
     * Removes ids on new diagram
     * @param page
     * @returns {*}
     *
    removeDiagramId: function(page) {
        if (page === 'home') {
            Session.set('diagramId', null);
        }
        return page;
    },

    /**
     * Increments the generation to help the flow of the site
     * @param page
     *
    generation: function(page) {
        Session.set('generation', Session.get('generation') + 1);
    }
});

Meteor.Router.filter('validateDiagram', {only: 'diagram'});
Meteor.Router.filter('removeDiagramId');

*/