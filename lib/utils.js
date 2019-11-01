var path = require('path');
var tsm = require('teamcity-service-messages');

var TEAMCITY_HIDDEN_ARTIFACTS_PATH = '.teamcity'

module.exports = {
    getTestName: function(testData, state) {
        return [
            testData.suite.fullName.trim(),
            (state || testData.state).name.trim(),
            testData.browserId.replace(/ /g, '')
        ].join('.').replace(/ /g, '_');
    },
    getImagePath: function(base, testData, type) {
        return path.join(
          base,
          testData.suite.fullName.trim(),
          testData.state.name.trim(),
          testData.browserId.trim(),
          type + '.png'
        );
    },
    reportScreenshot: function(testName, imagePath, flowId) {
        tsm.publishArtifacts(
            path.resolve(imagePath) + ' => ' + path.join(
              TEAMCITY_HIDDEN_ARTIFACTS_PATH,
              path.dirname(imagePath)
            )
        );
        tsm.testMetadata({
            testName: testName,
            type: 'image',
            flowId: flowId,
            value: path.join(
              TEAMCITY_HIDDEN_ARTIFACTS_PATH,
              imagePath
            ).replace(/\\/g,"/")
        });
    },
    startSuite: function(suiteName, flowId) {
        if (flowId)
            tsm.testSuiteStarted({ name: suiteName, flowId: flowId});
        else
            tsm.testSuiteStarted({ name: suiteName});
    },
    finishSuite: function(suiteName, flowId) {
        if (flowId)
            tsm.testSuiteFinished({ name: suiteName, flowId: flowId });
        else
            tsm.testSuiteFinished({ name: suiteName });
    }
};
