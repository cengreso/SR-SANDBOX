SELECT
	collab.custrecord_collab_role as role,
	collab.custrecord_collab_userid as userid,
	collab.custrecord_collab_usertype as usertype,
	collab.custrecord_collab_subsidiary as subsidiary,
FROM
	customrecord_box_collaborator_by_sub collab
JOIN
	map_customrecord_box_collaborator_by_sub_custrecord_collab_subsidiary multi
		ON multi.mapone = collab.id
WHERE
	maptwo = ?