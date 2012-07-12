(function()
{
	/**
	 * YUI Library aliases
	 */
	var Dom = YAHOO.util.Dom;

	/**
	 * Alfresco Slingshot aliases
	 */
	var $hasEventInterest = Alfresco.util.hasEventInterest;

	/**
	 * Unzip archive.
	 *
	 * @method onUnzip
	 * @param record
	 *            {object} record to be actioned
	 */
	YAHOO.Bubbling.fire("registerAction",
	{
		actionName: "onUnzip",
		fn: function dlA_onUnzip(record)
		{
			var parentNodeRef = record.parent.nodeRef;
			var fileName = record.fileName;
			var folderName = fileName.substring(0, fileName.lastIndexOf('.'));
			var unzipDialog = new Alfresco.module.SimpleDialog(this.id);

			var doBeforeDialogShow = function dlA_doBeforeDialogShow(p_form, p_dialog)
			{
				var formElt = Dom.get(p_form.formId);
				formElt.setAttribute("action", Alfresco.constants.PROXY_URI + "slingshot/doclib/action/unzip");

				// Events
				YAHOO.util.Event.addListener(Dom.get(this.id + '-other-space'), "click", this.modules.actions.onUnzipDestinationSpaceClick, this, true);
				YAHOO.Bubbling.on("unzipDestinationFolderSelected", function (layer, args) {
					var params = args[1],
							enabled = this.unZipActionFormValidation(params.field, params.args, params.event, p_form.formId, true, "");

					p_form.submitElements[0].set("disabled", !enabled);
				}, this);

				var onRadioClick = function(e, obj) {
					var radios = obj[0];

					if (this.checked && radios && radios.length > 0) {
						for (var i=0, ii=radios.length ; i<ii ; i++) {
							var radio = radios[i],
									parentClassName = radio.parentNode.className.split(' ')[0],
									elts = Dom.getElementsByClassName(parentClassName, 'td', obj[1]);

							if (radio.id == this.id) {
								Dom.addClass(elts, "selected");
							} else {
								Dom.removeClass(elts, "selected");
							}
						}
					}
				};

				var radioElts = YAHOO.util.Selector.query('td input[type=radio]', p_form.formId);
				YAHOO.util.Event.addListener(radioElts, "click", onRadioClick, [radioElts, p_form.formId]);
			};

			this.unZipActionFormValidation = function(field, args, event, form, silent, message) {
				var selectedRadio = YAHOO.util.Dom.getElementsBy(function (el) { return (el.name === 'unzip' && el.checked); }, 'input', form.formId, null, null, null, true);
				if (selectedRadio) {
					var isOtherSpaceSelected = (selectedRadio.id == (args.id + "-other-space"));
					if (!isOtherSpaceSelected || (isOtherSpaceSelected && Dom.get(args.id + "-destination-node").value != "")) {
						return true;
					}
				}

				return false;
			};

			var doSetupFormsValidation = function dlA_oACT_doSetupFormsValidation(p_form) {
				p_form.addValidation(this.id + "-other-space", this.unZipActionFormValidation, this, "change");
				p_form.addValidation(this.id + "-new-space", this.unZipActionFormValidation, this, "change");
				p_form.addValidation(this.id + "-self-space", this.unZipActionFormValidation, this, "change");
				p_form.setShowSubmitStateDynamically(true, false);
			};

			unzipDialog.setOptions(
			{
				width: "800px",
				templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "components/documentlibrary/unzip",
				templateRequestParams: {
					folderName: folderName,
					archiveNodeRef: record.nodeRef,
					createChildren: record.parent.permissions.user.CreateChildren || false, // IE does not return false if the user don't have appropriate permissions
					htmlid: this.id
				},
				destroyOnHide: true,
				firstFocus: this.id + "-self-space",
				doBeforeDialogShow:
				{
					fn: doBeforeDialogShow,
					scope: this
				},
				doSetupFormsValidation:
				{
					fn: doSetupFormsValidation,
					scope: this
				},

				onSuccess:
				{
					fn: function (response)
					{
						// Fire "folderCreated"
						YAHOO.Bubbling.fire("folderCreated", {
							name: folderName,
							parentNodeRef: parentNodeRef
						});

						Alfresco.util.PopupManager.displayMessage(
						{
							text: Alfresco.util.message("onUnzip.message.unzip.success")
						});
					},
					scope: this
				},

				onFailure:
				{
					fn: function (response)
					{
						Alfresco.util.PopupManager.displayMessage(
						{
							text: Alfresco.util.message("onUnzip.message.unzip.failure")
						});
					},
					scope: this
				}
			}).show();
		}
	});

	/**
	 * Dialog select destination button event handler
	 *
	 * @method onUnzipDestinationSpaceClick
	 * @param e
	 *            {object} DomEvent
	 * @param p_obj
	 *            {object} Object passed back from addListener method
	 */
	Alfresco.module.DoclibActions.prototype.onUnzipDestinationSpaceClick = function dlA_onUnzipDestinationSpaceClick(e, p_obj)
	{
		// Set up select destination dialog
		if (!this.widgets.unzipDestinationSpaceDialog)
		{
			this.widgets.unzipDestinationSpaceDialog = new Alfresco.module.DoclibGlobalFolder(this.id + '-sourceDialog');
			var allowedViewModes = [ Alfresco.module.DoclibGlobalFolder.VIEW_MODE_REPOSITORY, Alfresco.module.DoclibGlobalFolder.VIEW_MODE_SITE ];

			this.widgets.unzipDestinationSpaceDialog.setOptions(
			{
				viewMode: Alfresco.module.DoclibGlobalFolder.VIEW_MODE_REPOSITORY,
				allowedViewModes: allowedViewModes,
				title: Alfresco.util.message("title.destinationDialog")
			});
		}

		if (!this.widgets.destinationNode) {
			this.widgets.destinationNode = Dom.get(this.id + "-destination-node").value;
		}

		Dom.get(this.id + '-other-space').checked = true;

		// Make sure correct path is expanded
		if (this.widgets.destinationNode) {
			this.widgets.unzipDestinationSpaceDialog.setOptions(
			{
				pathNodeRef: new Alfresco.util.NodeRef(this.widgets.destinationNode)
			});
		}

		var me = this;
		this.widgets.unzipDestinationSpaceDialog.onOK = function(e, p_obj) {
			me.widgets.destinationNode = this.selectedNode.data.nodeRef;
			Dom.get(me.id + "-destination-node").value = this.selectedNode.data.nodeRef;

			// Update form submit element
			YAHOO.Bubbling.fire("unzipDestinationFolderSelected", {
				field: Dom.get(me.id + "-destination-node"),
				args: me
			});

			var destinationPathField = Dom.get(me.id + "-destination-path-field");
			destinationPathField.innerHTML = '"' + this.selectedNode.data.path + '"';

			this.widgets.dialog.hide();
		};

		this.widgets.unzipDestinationSpaceDialog.showDialog();
	};
})();