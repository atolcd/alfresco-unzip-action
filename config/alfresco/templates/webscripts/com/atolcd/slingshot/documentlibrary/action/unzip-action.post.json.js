/**
 * Unzip method
 *
 * @method POST
 * @param nodeRef {String}
 */

function main()
{
   try
   {
    var archiveNode = null;
	if (json.has('archive-node')) {
	  archiveNode = search.findNode(json.get('archive-node'));
	}

	var destinationSpace = null;
    if (json.get('unzip') == 'other') {
		// unzip into a selected space
		if (json.has('destination-node')) {
		  destinationSpace = search.findNode(json.get('destination-node'));
		}
	} else {
		if (json.get('unzip') == 'new' && json.has('space-name')) {
			// unzip into a new space
			destinationSpace = archiveNode.parent.createFolder(json.get('space-name'));
		} else {
			// unzip into current space
			destinationSpace = archiveNode.parent;
		}
	}

	// create unzip action
	var importer = actions.create("import");
	importer.parameters.encoding = "UTF-8";
	importer.parameters.destination = destinationSpace;
	importer.execute(archiveNode);

	status.code = 200;
   }
   catch (e)
   {
      status.code = 500;
      status.message = "Unexpected error occured during content extraction.";

      if (e.message && e.message.indexOf("org.alfresco.service.cmr.usage.ContentQuotaException") == 0)
      {
         status.code = 413;
         status.message = e.message;
      }
      status.redirect = true;
      return;
   }
}

main();