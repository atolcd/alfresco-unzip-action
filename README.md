"Unzip" action for Alfresco Share
================================

This extension allows you to add "Unzip" action in Alfresco Share Document Library web tier (available in both Document Library site and repository).  

Building the module
-------------------
Check out the project if you have not already done so 

        git clone git://github.com/atolcd/alfresco-unzip-action.git

An Ant build script is provided to build JAR file **OR** AMP files containing the custom files.  

To build JAR file, run the following command from the base project directory:

        ant dist-jar

If you want to build AMP file, run the following command:

        ant dist-amp


Installing the module
---------------------
This extension is a standard Alfresco Module, so experienced users can skip these steps and proceed as usual.

### 1st method: Installing JAR (recommended)
1. Stop Alfresco
2. Copy `unzip_share_action-X.X.X.jar` into the `/tomcat/shared/lib/` folder of your Alfresco (You might need to create this folder if it does not already exist).
3. Start Alfresco


### 2nd method: Installing AMPs
1. Stop Alfresco
2. Use the Alfresco [Module Management Tool](http://wiki.alfresco.com/wiki/Module_Management_Tool) to install the modules in your Alfresco and Share WAR files:

        java -jar alfresco-mmt.jar install alfresco-unzip_share_action-vX.X.X.amp $TOMCAT_HOME/webapps/alfresco.war -force
        java -jar alfresco-mmt.jar install share-unzip_share_action-vX.X.X.amp $TOMCAT_HOME/webapps/share.war -force

3. Delete the `$TOMCAT_HOME/webapps/alfresco/` and `$TOMCAT_HOME/webapps/share/` folders.  
**Caution:** please ensure you do not have unsaved custom files in the webapp folders before deleting.
4. Start Alfresco


Using the module
---------------------
"Unzip" action will now be available for zip files.


LICENSE
---------------------
This extension is licensed under `GNU Library or "Lesser" General Public License (LGPL)`.  
Created by: [Julien BERTHOUX] (https://github.com/jberthoux) and [Bertrand FOREST] (https://github.com/bforest)  


Our company
---------------------
[Atol Conseils et Développements] (http://www.atolcd.com) is Alfresco [Gold Partner] (http://www.alfresco.com/partners/atol)  
Follow us on twitter [ @atolcd] (https://twitter.com/atolcd)  