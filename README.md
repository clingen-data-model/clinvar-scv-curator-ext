# clinvar-scv-curator-ext
Chrome extension to allow curators to capture SCV data to a google sheet directly from clinvar website.

## Release Notes

### v1.5.2 changes
* Add 2 new entries to drop down for rules...
  * “Review by VCEP, no evidence has been provided to dispute this classification”
  * “Reviewed by VCEP, VCEP needs to recurate variant based on new evidence”

### v1.5.1 changes
* Added debugging code to gather analytics on why some installations are freezing.

### v1.5 changes

* Add 2 new entries to drop down for rules...
    * “New submission from submitter that appears to have been intended to update this older submission”
    * “Submitter acknowledged an error and the submission will be updated or removed. “

* Replaced rule entry in dropdown from...
    * “Unnecessary benign claim when other interpretations are pathogenic”
    * “B/BL/VUS claim when a mutually exclusive disease association is P/LP”

* Added new Override fields: Condition, Inheritance

* Submitter field sometimes pulls from Study field. See lines 12-14 in spreadsheet
