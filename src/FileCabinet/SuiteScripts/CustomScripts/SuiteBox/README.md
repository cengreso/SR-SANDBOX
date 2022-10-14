# SuiteBox
Folder creation for onboarding Employee

```
var foldercreation = suitebox.createFolder2({id: newRec.id, type: newRec.type, suiteboxtype: 'onboarding'});
```

Adding Collaborators to the folder
---- Single Collaborators
```
var objCollab = suitebox.addCollab2({
		type: 'folder', // folder
		id: folderId, // target folder id
		userid: 19025149015, // OR userid: '53397',email: emailSalesRep,
		role: 'co-owner',
		usertype: 'group',
		recType:'employee'
})
```

---- Multiple Collaborators Based on its Subsidiary
```
var objCollab = suitebox.addCollab2({collab by subsidiary
	subsidiary: newRec.getValue('subsidiary'),
	recType:'employee',
	collabs:true,
	folderId:folderId
})
```