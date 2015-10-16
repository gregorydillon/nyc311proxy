# nyc311proxy
Node app that gets the last 30 days of NYC 311 data

NYC 311 data is published via Socrata.  The '2010 to present' dataset is very large and would require many gigabytes to download. 

This tool gets just the last 30 days by building an API call that queries for `created_date>='YYYY-MM-DD'`, swapping out the appropriate date from 30 days prior to today.

Live at [http://nyc311proxy.herokuapp.com/](http://nyc311proxy.herokuapp.com/)
