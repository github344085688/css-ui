<template>
    <form  @submit.prevent="onSubmit('form-1')" data-vv-scope="form-1" v-loding="!onload">
      <div class="setup-billing" v-if="onload">
       <!-- <div class="icon-box d-flex justify-content-center flex-wrap  zoomIn animated">
          <div class="col-12"><img src="@/assets/images/onboard/test-and-training.svg"/></div>
          <div class="col-12 mt-3"><h2>Test & Training</h2></div>
        </div>-->
          <div  v-if="!permission" class="d-flex justify-content-center align-items-center" style="position: relative; width: 100%; height: 200px;"> <span>No Permission</span> </div>
        <div class="account-content" v-if="permission">
          <div class="d-flex flex-wrap">
            <div class="col-12 p-0 d-flex align-items-center">
              <div class="col-2 p-0 ml-auto">
                <button type="button" v-if="permission==='write'" class="unis-btn unis-btn-primary unis-sm " @click="createTestTraining()"><i class="unis-plus accents-bg  mr-2 "></i>Create</button>
              </div>
            </div>
          </div>

          <div class="d-flex flex-wrap animated fadeInUp mt-5" >
            <table class="table table-hover">
              <thead>
              <tr>
                <th scope="col" class="border-top-0" width="15%">JIRA Ticket</th>
                <th scope="col" class="border-top-0">Resolution</th>
                <th scope="col" class="border-top-0">Summary</th>
                <th scope="col" class="border-top-0" width="15%">Status</th>
                <th scope="col" class="border-top-0" width="15%">Retailer</th>
                <th scope="col" class="border-top-0" width="15%"> Label/BOL/Packing List</th>
                <th scope="col" class="border-top-0" width="15%"> files</th>
              </tr>
              </thead>
              <tbody>
              <tr  v-for="testTraining in testTrainings" :key="testTraining.jiraTicket">
                <td scope="row">
                  <span class="link-style"  @click="testTrainingDetails(testTraining.issueId)">{{testTraining.jiraTicket}}</span>
                </td>
                <td>{{testTraining.resolution}}</td>
                <td>{{testTraining.summary}}</td>
                <td>
                  <span class="unis-labels solid" v-if="testTraining.status ==='New'">NEW</span>
                  <span class="unis-labels border-blue" v-if="testTraining.status ==='Open'">OPEN</span>
                  <span class="unis-labels border-red" v-if="testTraining.status ==='Rejected'">REJECTED</span>
                  <span class="unis-labels border-darkgray " v-if="testTraining.status ==='Closed'">Closed</span>
                </td>
                  <td> <span v-if="testTraining.compliance">{{testTraining.compliance.carrierOrRetailer}}</span></td>
                  <td> <span v-if="testTraining.compliance">{{testTraining.compliance.accountNoOrLabelOrBolOrPackingList}}</span></td>
                  <td> <span v-if="testTraining.compliance"> <wise-download-2 :is-remove ="false" :file-ids="testTraining.compliance.fileIds" :title="''"></wise-download-2></span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <page-footer :data="stepDetail"></page-footer>
        <next-step :isNextStep="isNextStep" @cancel="emitCancel"  :isCancel="false" v-if="permission==='write'"></next-step>
          <div class="d-flex">
              <button type="button" class="unis-btn unis-btn-primary unis-sm mr-4 " @click="aa">JIRA Ticket</button>
              <button type="button" class="unis-btn unis-btn-primary unis-sm mr-4" @click="cc">Resolution</button>
              <button type="button" class="unis-btn unis-btn-primary unis-sm mr-4" @click="dd">Summary</button>
              <button type="button" class="unis-btn unis-btn-primary unis-sm mr-4" @click="ee">Status</button>
          </div>


          <div class="p-4">
              <div class="">
                  <table class="unis-data-table" v-fixedHead="350">
                     <thead>
                      <tr>
                          <th  style="padding: 5px 5px" >ID </th>
                          <th  style="padding: 5px 5px" fixed>Company Name</th>
                          <th  style="padding: 5px 5px" fixed>Last</th>
                          <th  style="padding: 5px 5px" >First</th>
                          <th  style="padding: 5px 5px" >Email</th>
                          <th  style="padding: 5px 5px" >Platform access</th>
                      </tr>
                      </thead>
                      <tbody>
                     <tr v-for="(tbody, index) in tableTbody" :key="index">
                         <td  style="padding: 5px 5px">{{index}}</td>
                         <td  style="padding: 5px 5px">{{tbody.name}}</td>
                         <td  style="padding: 5px 5px">{{tbody.Last}}</td>
                         <td  style="padding: 5px 5px">{{tbody.First}}</td>
                         <td  style="padding: 5px 5px">{{tbody.Email}}</td>
                         <td  style="padding: 5px 5px">{{tbody.Platform}}</td>
                     </tr>
                     </tbody>
                  </table>
              </div>
          </div>
          <div class="p-4">
              <div class="">
                  <table class="unis-data-table" v-fixedHead="350">
                      <thead>
                      <tr>
                          <th  style="padding: 5px 5px" >ID </th>
                          <th  style="padding: 5px 5px" >Company Name</th>
                          <th  style="padding: 5px 5px" >Last</th>
                          <th  style="padding: 5px 5px" >First</th>
                          <th  style="padding: 5px 5px" fixed >Email</th>
                          <th  style="padding: 5px 5px" fixed>Platform access</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(tbody, index) in tableTbody" :key="index">
                          <td  style="padding: 5px 5px">{{index}}</td>
                          <td  style="padding: 5px 5px">{{tbody.name}}</td>
                          <td  style="padding: 5px 5px">{{tbody.Last}}</td>
                          <td  style="padding: 5px 5px">{{tbody.First}}</td>
                          <td  style="padding: 5px 5px">{{tbody.Email}}</td>
                          <td  style="padding: 5px 5px">{{tbody.Platform}}</td>
                      </tr>
                      </tbody>
                  </table>
              </div>
          </div>


          <div class="p-4" >
              <div class="">
                  <table class="unis-data-table"  width="800"  v-fixedHead="350" >
                      <thead>
                      <tr>
                          <th  style="padding: 5px 15px">ID </th>
                          <th  style="padding: 5px 15px">Company Name</th>
                          <th  style="padding: 5px 15px">Last</th>
                          <th  style="padding: 5px 15px">First</th>
                          <th  style="padding: 5px 15px">Email</th>
                          <th  style="padding: 5px 15px">Platform access</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(tbody, index) in tableTbody" :key="index">
                          <td style="padding: 5px 15px">{{index}}</td>
                          <td style="padding: 5px 15px">{{tbody.name}}</td>
                          <td style="padding: 5px 15px">{{tbody.Last}}</td>
                          <td style="padding: 5px 15px">{{tbody.First}}</td>
                          <td style="padding: 5px 15px">{{tbody.Email}}</td>
                          <td style="padding: 5px 15px">{{tbody.Platform}}</td>
                      </tr>
                      </tbody>
                  </table>
              </div>
          </div>



         <!-- <div class="p-4">
              <div class="">
                  <table class="unis-data-table"  width="800"  v-fixedHead >
                      <thead>
                      <tr>
                          <th  style="padding: 5px 15px">ID </th>
                          <th  style="padding: 5px 15px">Company Name</th>
                          <th  style="padding: 5px 15px">Last</th>
                          <th  style="padding: 5px 15px">First</th>
                          <th  style="padding: 5px 15px">Email</th>
                          <th  style="padding: 5px 15px">Platform access</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(tbody, index) in tableTbody" :key="index">
                          <td style="padding: 5px 15px">{{index}}</td>
                          <td  style="padding: 5px 15px">{{tbody.name}}</td>
                          <td  style="padding: 5px 15px">{{tbody.Last}}</td>
                          <td  style="padding: 5px 15px">{{tbody.First}}</td>
                          <td  style="padding: 5px 15px">{{tbody.Email}}</td>
                          <td  style="padding: 5px 15px">{{tbody.Platform}}</td>
                      </tr>
                      </tbody>
                  </table>
              </div>
          </div>-->
      <!--    <template>
              <el-table
                      :data="tableData"
                      border
                      style="width: 800px">
                  <el-table-column
                          fixed
                          prop="date"
                          label="日期"
                          width="150">
                  </el-table-column>
                  <el-table-column
                          fixed
                          prop="name"
                          label="姓名"
                          width="120">
                  </el-table-column>
                  <el-table-column
                          fixed
                          prop="province"
                          label="省份"
                          width="120">
                  </el-table-column>
                  <el-table-column
                          fixed
                          prop="city"
                          label="市区"
                          width="120">
                  </el-table-column>
                  <el-table-column
                          prop="address"
                          label="地址"
                          width="300">
                  </el-table-column>
                  <el-table-column
                          prop="zip"
                          label="邮编"
                          width="120">
                  </el-table-column>
                  <el-table-column
                          fixed="right"
                          label="操作"
                          width="100">
                      <template slot-scope="scope">
                          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                          <el-button type="text" size="small">编辑</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </template>-->

         <!-- <div  class="unis-fixed-meter p-4" >
              <div class="fixed-header">
                  <table class="unis-data-table"  >
                      <colgroup>
                      </colgroup>
                      <thead>
                      <tr>
                          <th>ID</th>
                          <th>Company Name</th>
                          <th>User First</th>
                          <th>User Last</th>
                          <th>Email</th>
                          <th>Platform access</th>
                          <th>Create date</th>
                          <th>Create by</th>
                          <th>Last modify date</th>
                          <th>Last modify by</th>
                      </tr>
                      </thead>
                  </table>
              </div>
              <div class="fixed-body">

              </div>
          </div>-->
      </div>
    </form>
</template>
<style lang="scss" src="./test-and-training.scss"/>
