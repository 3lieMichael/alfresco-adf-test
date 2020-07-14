import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { NotificationService, SearchService, ObjectDataTableAdapter } from '@alfresco/adf-core';
import { DocumentListComponent, ContentNodeDialogService } from '@alfresco/adf-content-services';
import { PreviewService } from '../services/preview.service';
import { ResultSetPaging, ResultNode, ResultSetRowEntry } from '@alfresco/js-api';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html',
  styleUrls: ['./documentlist.component.css']
})
export class DocumentlistComponent implements OnInit {

  @Input()
  showViewer = false;
  nodeId: string = null;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  data: ObjectDataTableAdapter;
  schema: any;
  node: any;
  openSideNav = false;
  currentFolderId = '-root-';

  constructor(
    private notificationService: NotificationService,
    private preview: PreviewService,
    private searchService: SearchService,
    private contentDialogService: ContentNodeDialogService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const alias = params['alias'];

      this.currentFolderId = alias ? alias : '-root-';
    });
  }



  uploadSuccess(event: any) {
    console.log(event);
    this.notificationService.openSnackMessage('File uploaded');
    this.documentList.reload();
    this.showFileInfo(event);
  }

  showPreview(event) {
    this.previewFile(event.value.entry);
  }

  showFileInfo(event) {
    this.openSideNav = true;
    this.node = event.value.entry;
  }

  closeSideNav(){
    this.openSideNav = false;
  }

  onGoBack(event: any) {
    console.warn('onGoBack');
    this.showViewer = false;
    this.nodeId = null;
  }

  onItemClicked(event) {
    this.previewFile(event.entry);
  }

  previewFile(entry){
    if (entry && entry.isFile) {
      this.preview.showResource(entry.id);
    }
  }

  onSearchChanged(event: string) {
    this.searchService.search(event, 10, 0).pipe(
      map(x => {
        let res = [];
        x.list.entries.forEach(e => res.push(e.entry));
        return res;
      })

    ).subscribe((x) => {
      this.data = new ObjectDataTableAdapter(x, [
          {
              type: 'text',
              key: 'name',
              title: 'Name',
              sortable: true
          },
          {
              type: 'text',
              key: 'createdByUser.displayName',
              title: 'Created by'
          },
          {
              type: 'text',
              key: 'path.name',
              title: 'Path'
          }
      ]);
      console.log(this.data);
    });
  }

  afterCopy(event){
    console.warn('afterCopy');
    let entry = event.value.entry;
    this.notificationService.openSnackMessage(`"${entry.name}" was successfuly copied`, 3000);
  }

  afterMove(event){
    console.warn('afterCopy');
    this.documentList.reload();
    let entry = event.value.entry;
    this.notificationService.openSnackMessage(`"${entry.name}" was successfuly moved`, 3000);
  }

  afterDelete(event) {
    let entry = event.value.entry;
    this.documentList.reload();
    this.notificationService.openSnackMessage(`"${entry.name}" was successfuly deleted`, 3000);
  }

  onSuccess(event){
    console.warn('************************************************************');
    console.warn('drag and drop working');
    console.warn(event);
    console.warn('************************************************************');
  }

}


