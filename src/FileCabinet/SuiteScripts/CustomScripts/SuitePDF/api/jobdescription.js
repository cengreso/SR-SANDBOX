define(['N/record', 'N/file', 'N/ui/serverWidget', 'N/search', 'N/render', 'N/query'],
  function (record, file, serverWidget, search, render, query) {

    var generate = function (param) {
      var jobid = param.jobid;
      try {
        //GET THE TEMPLATE FILE
        var tmpPage = file.load({id: '../template/srjobmatrix3pdf_v1.html'});


        var objJob = suiteQLJobDesc(jobid)
        log.debug('objJob', objJob)


        var fileObj = file.load({id: 306920}); //to load image banner
        var imgURLForPDF = fileObj.url;

        var renderer = render.create();
        renderer.templateContent = tmpPage.getContents();
        log.debug('imgURL raw', imgURLForPDF+ '&amp;');
        log.debug('imgURL', imgURLForPDF.replace(/&/g, '&amp;') + '&amp;');
        renderer.templateContent = renderer.templateContent.replace('${bannerURL}', imgURLForPDF.replace(/&/g, '&amp;') + '&amp;');
        renderer.templateContent = renderer.templateContent.replace('${title}', objJob.title);
        renderer.templateContent = renderer.templateContent.replace('${custrecord_sr_job_family}', objJob.custrecord_sr_job_family);
        renderer.templateContent = renderer.templateContent.replace('${custrecord_sr_radford_jobcode}', objJob.custrecord_sr_radford_jobcode);
        renderer.templateContent = renderer.templateContent.replace('${custrecord_department}', objJob.custrecord_department);
        renderer.templateContent = renderer.templateContent.replace('${custrecord_sr_job_name}', objJob.custrecord_sr_job_name);
        renderer.templateContent = renderer.templateContent.replace('${description}', objJob.description);
        renderer.templateContent = renderer.templateContent.replace('${custrecord_sr_job_responsibilities}', objJob.custrecord_sr_job_responsibilities);
        renderer.templateContent = renderer.templateContent.replace('${custrecord_sr_job_skills}', objJob.custrecord_sr_job_skills);
        renderer.templateContent = renderer.templateContent.replace('${custrecordsr_job_qualifications}', objJob.custrecordsr_job_qualifications);

        return renderer.renderAsPdf();
      } catch (e) {
        log.debug('Error Generating PDF', e)
      }
    }

    function suiteQLJobDesc(jobid) {
      var sql = "SELECT " +
        "jb.title," +
        "jbfam.name, " +
        "dep.name, " +
        "jb.custrecord_sr_radford_jobcode, " +
        "jb.custrecord_sr_job_name, " +
        "jb.description, " +
        "jb.custrecord_sr_job_responsibilities, " +
        "jb.custrecord_sr_job_skills, " +
        "jb.custrecordsr_job_qualifications " +
        "FROM hcmjob as jb " +
        "LEFT JOIN customrecord_sr_job_family jbfam " +
        "ON jb.custrecord_sr_job_family = jbfam.id " +
        "LEFT  JOIN department dep " +
        "ON jb.custrecord_department = dep.id " +
        "WHERE jb.id = " + jobid + ";"
      var resIterator = query.runSuiteQLPaged({
        query: sql,
        pageSize: 100
      }).iterator();
      var objJob = {}
      resIterator.each(function (page) {
        var resIterator = page.value.data.iterator();
        resIterator.each(function (row) {
          objJob = {
            title: row.value.getValue(0) ? row.value.getValue(0).replace(/&/g, '&amp;') : '',
            custrecord_sr_job_family: row.value.getValue(1) ? row.value.getValue(1).replace(/&/g, '&amp;') : '',
            custrecord_department: row.value.getValue(2) ? row.value.getValue(2).replace(/&/g, '&amp;') : '',
            custrecord_sr_radford_jobcode: row.value.getValue(3) ? row.value.getValue(3).replace(/&/g, '&amp;') : '',
            custrecord_sr_job_name: row.value.getValue(4) ? row.value.getValue(4).replace(/&/g, '&amp;') : '',
            description: row.value.getValue(5) ? row.value.getValue(5).replace(/&/g, '&amp;') : '',
            custrecord_sr_job_responsibilities: row.value.getValue(6) ? rmHTMLtags(row.value.getValue(6)) : '',
            custrecord_sr_job_skills: row.value.getValue(7) ? rmHTMLtags(row.value.getValue(7)) : '',
            custrecordsr_job_qualifications: row.value.getValue(8) ? rmHTMLtags(row.value.getValue(8)) : '',
          }
          return false;
        });
        return true;
      });
      log.debug('responsibilities', objJob.custrecord_sr_job_responsibilities)
      return objJob;
    }

    function rmHTMLtags(text) {
      try {
        if (text)
          return text.replace(/<br>/g, 'breakthisline').replace(/<[^>]*>?/gm, '').replace(/breakthisline/g, ' <br/>').replace(/&/g, '&amp;')
        // return text.replaceAll('<br>', '||br||').replace(/<[^>]*>?/gm, '').replaceAll('||br||', ' <br/>').replaceAll('&', '&amp;')
        else
          return ''
      } catch (e) {
        log.debug('Error', e)
      }
    }

    return {generate: generate}

  });
