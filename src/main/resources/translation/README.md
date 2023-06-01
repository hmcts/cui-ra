# Service Specific Text

### Adding a new service

Within both "en" and "cy" folders, add a new folder with the same name as the serviceId that will be passed to CUI-RA in the invokation parameters. i.e probate

 Within the new service folders, add a file "contact.json". Inside this file you will need to specify all of the information required for the contact panel on the right-hand side of all screens. An example is shown below.

 ```$json
--- FILE: contact.json ---
{
  ADD RELEVANT JSON FOR CONTACT HERE
}
```

Within the new service folders, add a file "flags.json". Inside this file you will need to specify all service specific flag content with the structure `flag-id -> flag property text`. An example is shown below.

* The flag id will need to be the same as is passed to CUI-RA by ref data
* The flag property text is defined in the translation files.

```$json
--- FILE: serviceId.json ---
{
  "flag-1": {
      "blurb": "This is the text that will be shown"
  },
  "flag-2": {
      "blurb": "This is the text that will be shown"
  }
}
```

Ensure you define both the English and Welsh translations!