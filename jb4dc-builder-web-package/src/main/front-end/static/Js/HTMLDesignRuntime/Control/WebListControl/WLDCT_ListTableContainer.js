var WLDCT_ListTableContainer= {
    GetHTML:function(){
        return "<table id=\"example\" class=\"stripe row-border order-column\" style=\"width:100%\">\n" +
            "        <thead>\n" +
            "            <tr>\n" +
            "                <th colspan='2'>First name</th>\n" +
            "                <th>Position</th>\n" +
            "                <th>Office</th>\n" +
            "                <th colspan='2'>Age</th>\n" +
            "                <th>Salary</th>\n" +
            "                <th>Extn.</th>\n" +
            "                <th>E-mail</th>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <th>First name</th>\n" +
            "                <th>Last name</th>\n" +
            "                <th>Position</th>\n" +
            "                <th>Office</th>\n" +
            "                <th>Age</th>\n" +
            "                <th>Start date</th>\n" +
            "                <th>Salary</th>\n" +
            "                <th>Extn.</th>\n" +
            "                <th>E-mail</th>\n" +
            "            </tr>\n" +
            "        </thead>\n" +
            "        <tbody>\n" +
            "            <tr>\n" +
            "                <td><a onclick='alert(1)'>Tiger</a></td>\n" +
            "                <td>Nixon</td>\n" +
            "                <td>System Architect</td>\n" +
            "                <td>Edinburgh</td>\n" +
            "                <td>61</td>\n" +
            "                <td>2011/04/25</td>\n" +
            "                <td>$320,800</td>\n" +
            "                <td>5421</td>\n" +
            "                <td>t.nixon@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Garrett</td>\n" +
            "                <td>Winters</td>\n" +
            "                <td>Accountant</td>\n" +
            "                <td>Tokyo</td>\n" +
            "                <td>63</td>\n" +
            "                <td>2011/07/25</td>\n" +
            "                <td>$170,750</td>\n" +
            "                <td>8422</td>\n" +
            "                <td>g.winters@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Ashton</td>\n" +
            "                <td>Cox</td>\n" +
            "                <td>Junior Technical Author</td>\n" +
            "                <td>San Francisco</td>\n" +
            "                <td>66</td>\n" +
            "                <td>2009/01/12</td>\n" +
            "                <td>$86,000</td>\n" +
            "                <td>1562</td>\n" +
            "                <td>a.cox@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Cedric</td>\n" +
            "                <td>Kelly</td>\n" +
            "                <td>Senior Javascript Developer</td>\n" +
            "                <td>Edinburgh</td>\n" +
            "                <td>22</td>\n" +
            "                <td>2012/03/29</td>\n" +
            "                <td>$433,060</td>\n" +
            "                <td>6224</td>\n" +
            "                <td>c.kelly@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Airi</td>\n" +
            "                <td>Satou</td>\n" +
            "                <td>Accountant</td>\n" +
            "                <td>Tokyo</td>\n" +
            "                <td>33</td>\n" +
            "                <td>2008/11/28</td>\n" +
            "                <td>$162,700</td>\n" +
            "                <td>5407</td>\n" +
            "                <td>a.satou@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Brielle</td>\n" +
            "                <td>Williamson</td>\n" +
            "                <td>Integration Specialist</td>\n" +
            "                <td>New York</td>\n" +
            "                <td>61</td>\n" +
            "                <td>2012/12/02</td>\n" +
            "                <td>$372,000</td>\n" +
            "                <td>4804</td>\n" +
            "                <td>b.williamson@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Herrod</td>\n" +
            "                <td>Chandler</td>\n" +
            "                <td>Sales Assistant</td>\n" +
            "                <td>San Francisco</td>\n" +
            "                <td>59</td>\n" +
            "                <td>2012/08/06</td>\n" +
            "                <td>$137,500</td>\n" +
            "                <td>9608</td>\n" +
            "                <td>h.chandler@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Rhona</td>\n" +
            "                <td>Davidson</td>\n" +
            "                <td>Integration Specialist</td>\n" +
            "                <td>Tokyo</td>\n" +
            "                <td>55</td>\n" +
            "                <td>2010/10/14</td>\n" +
            "                <td>$327,900</td>\n" +
            "                <td>6200</td>\n" +
            "                <td>r.davidson@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Colleen</td>\n" +
            "                <td>Hurst</td>\n" +
            "                <td>Javascript Developer</td>\n" +
            "                <td>San Francisco</td>\n" +
            "                <td>39</td>\n" +
            "                <td>2009/09/15</td>\n" +
            "                <td>$205,500</td>\n" +
            "                <td>2360</td>\n" +
            "                <td>c.hurst@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Sonya</td>\n" +
            "                <td>Frost</td>\n" +
            "                <td>Software Engineer</td>\n" +
            "                <td>Edinburgh</td>\n" +
            "                <td>23</td>\n" +
            "                <td>2008/12/13</td>\n" +
            "                <td>$103,600</td>\n" +
            "                <td>1667</td>\n" +
            "                <td>s.frost@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Jena</td>\n" +
            "                <td>Gaines</td>\n" +
            "                <td>Office Manager</td>\n" +
            "                <td>London</td>\n" +
            "                <td>30</td>\n" +
            "                <td>2008/12/19</td>\n" +
            "                <td>$90,560</td>\n" +
            "                <td>3814</td>\n" +
            "                <td>j.gaines@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Quinn</td>\n" +
            "                <td>Flynn</td>\n" +
            "                <td>Support Lead</td>\n" +
            "                <td>Edinburgh</td>\n" +
            "                <td>22</td>\n" +
            "                <td>2013/03/03</td>\n" +
            "                <td>$342,000</td>\n" +
            "                <td>9497</td>\n" +
            "                <td>q.flynn@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Charde</td>\n" +
            "                <td>Marshall</td>\n" +
            "                <td>Regional Director</td>\n" +
            "                <td>San Francisco</td>\n" +
            "                <td>36</td>\n" +
            "                <td>2008/10/16</td>\n" +
            "                <td>$470,600</td>\n" +
            "                <td>6741</td>\n" +
            "                <td>c.marshall@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Haley</td>\n" +
            "                <td>Kennedy</td>\n" +
            "                <td>Senior Marketing Designer</td>\n" +
            "                <td>London</td>\n" +
            "                <td>43</td>\n" +
            "                <td>2012/12/18</td>\n" +
            "                <td>$313,500</td>\n" +
            "                <td>3597</td>\n" +
            "                <td>h.kennedy@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Tatyana</td>\n" +
            "                <td>Fitzpatrick</td>\n" +
            "                <td>Regional Director</td>\n" +
            "                <td>London</td>\n" +
            "                <td>19</td>\n" +
            "                <td>2010/03/17</td>\n" +
            "                <td>$385,750</td>\n" +
            "                <td>1965</td>\n" +
            "                <td>t.fitzpatrick@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Michael</td>\n" +
            "                <td>Silva</td>\n" +
            "                <td>Marketing Designer</td>\n" +
            "                <td>London</td>\n" +
            "                <td>66</td>\n" +
            "                <td>2012/11/27</td>\n" +
            "                <td>$198,500</td>\n" +
            "                <td>1581</td>\n" +
            "                <td>m.silva@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Charde</td>\n" +
            "                <td>Marshall</td>\n" +
            "                <td>Regional Director</td>\n" +
            "                <td>San Francisco</td>\n" +
            "                <td>36</td>\n" +
            "                <td>2008/10/16</td>\n" +
            "                <td>$470,600</td>\n" +
            "                <td>6741</td>\n" +
            "                <td>c.marshall@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Haley</td>\n" +
            "                <td>Kennedy</td>\n" +
            "                <td>Senior Marketing Designer</td>\n" +
            "                <td>London</td>\n" +
            "                <td>43</td>\n" +
            "                <td>2012/12/18</td>\n" +
            "                <td>$313,500</td>\n" +
            "                <td>3597</td>\n" +
            "                <td>h.kennedy@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Tatyana</td>\n" +
            "                <td>Fitzpatrick</td>\n" +
            "                <td>Regional Director</td>\n" +
            "                <td>London</td>\n" +
            "                <td>19</td>\n" +
            "                <td>2010/03/17</td>\n" +
            "                <td>$385,750</td>\n" +
            "                <td>1965</td>\n" +
            "                <td>t.fitzpatrick@datatables.net</td>\n" +
            "            </tr>\n" +
            "            <tr>\n" +
            "                <td>Michael</td>\n" +
            "                <td>Silva</td>\n" +
            "                <td>Marketing Designer</td>\n" +
            "                <td>London</td>\n" +
            "                <td>66</td>\n" +
            "                <td>2012/11/27</td>\n" +
            "                <td>$198,500</td>\n" +
            "                <td>1581</td>\n" +
            "                <td>m.silva@datatables.net</td>\n" +
            "            </tr>\n" +
            "        </tbody>\n" +
            "    </table>"
    },
    RendererChain: function (_rendererChainParas) {
        //$singleControlElem.hide();
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var $buttonDivElemList=$singleControlElem.find("div"+HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
        //$singleControlElem.find("[is-op-button-wrap-table='true']").hide();
        $singleControlElem.find(".wldct-list-table-inner-wrap").html(this.GetHTML());
        $singleControlElem.find(".wldct-list-table-inner-wrap").width("500px");
        var table = $('#example').DataTable( {
            scrollY:        "400px",
            scrollX:        true,
            paging:         false,
            "ordering": false,
            "searching": false,
            "info": false
        } );
    },
    RendererDataChain:HTMLControl.RendererDataChain
}