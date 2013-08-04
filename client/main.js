Template.diagram.diagram = function() {
    console.log(Session.get('diagramId'));
    return Diagram.findOne(Session.get('diagramId'));
};

