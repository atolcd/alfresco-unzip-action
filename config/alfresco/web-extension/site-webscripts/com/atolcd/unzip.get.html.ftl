<#assign el = args.htmlid?html />
<#assign folderName = args.folderName!"" />
<#assign createChildren = (args.createChildren!"false")?js_string />

<div id="${el}-dialog" class="unzip-option-container">
	<div class="hd">${msg("label.extract.to")}</div>

	<form id="${el}-form" action="" method="POST">
		<input id="${el}-archive-node" type="hidden" name="archive-node" value="${args.archiveNodeRef!""}" />

		<table class="yui-g">
			<tr class="tb-header">
				<td class="first-col"><label for="${el}-other-space">${msg("label.extract.to")} <span id="${el}-destination-path-field" name="destination-path-field" class="path"><br>(${msg("label.choose.space")})</span></label></td>
				<td class="middle-col"><label for="${el}-new-space">${msg("label.extract.to.space")} <span class="path">"/${folderName}"</span></label></td>
				<td class="last-col<#if createChildren == "true"> selected</#if>"><label for="${el}-self-space">${msg("label.extract.here")}</label></td>
			</tr>

			<tr class="tb-body">
				<td class="first-col">
					<label for="${el}-other-space">
						<div class="other-space-icon">
							<input id="${el}-destination-node" type="hidden" name="destination-node" value="" />
						</div>
					</label>
				</td>
				<td class="middle-col">
					<label for="${el}-new-space">
						<div class="new-space-icon<#if createChildren == "false"> unavailable</#if>"></div>
					</label>
				</td>
				<td class="last-col<#if createChildren == "true"> selected</#if>">
					<label for="${el}-self-space">
						<div class="self-space-icon<#if createChildren == "false"> unavailable</#if>"></div>
					</label>
				</td>
			</tr>

			<tr class="tb-footer">
				<td class="first-col">
					<input type="radio" id="${el}-other-space" name="unzip" value="other" />
				</td>
				<td class="middle-col">
					<input type="radio" id="${el}-new-space" name="unzip" value="new" <#if createChildren == "false">disabled class="hidden"</#if> />
					<input id="${el}-space-name" type="hidden" name="space-name" value="${folderName}" />
				</td>
				<td class="last-col<#if createChildren == "true"> selected</#if>">
					<input type="radio" id="${el}-self-space" name="unzip" value="self" <#if createChildren == "true">checked<#else>disabled class="hidden"</#if> />
				</td>
			</tr>
		</table>

		<div class="bdft">
			<input type="submit" id="${el}-ok" value="${msg('button.extract')}" tabindex="1" />
			<input type="submit" id="${el}-cancel" value="${msg('button.cancel')}" tabindex="2" />
		</div>
	</form>

</div>